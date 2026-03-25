import hashlib
import json
import base64
import webbrowser
from http.server import SimpleHTTPRequestHandler
import socketserver
import threading
import time

from cryptography.hazmat.primitives.asymmetric import rsa, padding  # pyre-ignore[21]
from cryptography.hazmat.primitives.asymmetric.utils import Prehashed  # pyre-ignore[21]
from cryptography.hazmat.primitives import hashes, serialization  # pyre-ignore[21]


# =============================================================================
# CẶP KEY MẶC ĐỊNH
# Để trống → tự sinh khi chạy. Hoặc paste PEM key cố định vào đây.
# =============================================================================
DEFAULT_PRIVATE_KEY = ""
DEFAULT_PUBLIC_KEY = ""


# =============================================================================
# LOGIC MẬT MÃ (Cryptography Logic)
# =============================================================================

def crypto_hash(text: str) -> str:
    """
    Băm SHA-256.
    - Công thức: H = SHA256(text)
    - Input:  chuỗi bất kỳ          → vd: "ABCDE"
    - Output: chuỗi hex 64 ký tự    → vd: "2d711642b726b04..."
    - Tính chất: cùng input → cùng output, không giải ngược được
    """
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def crypto_generate_keys() -> tuple[str, str]:
    """
    Sinh cặp khóa RSA-2048.
    - Private Key (bí mật): dùng để KÝ
    - Public Key (công khai): dùng để XÁC MINH
    - Định dạng: PEM string (base64)
    - Returns: (private_key_pem, public_key_pem)
    """
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    pri_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("utf-8")

    pub_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("utf-8")

    return pri_pem, pub_pem


def crypto_sign(hash_hex: str, private_key_pem: str) -> str:
    """
    Ký điện tử: hash + private key → chữ ký.
    - Công thức: Signature = Hash^d mod n  (d = private exponent, n = modulus)
    - hash_hex:        chuỗi hex SHA-256 (64 ký tự)
    - private_key_pem: private key dạng PEM
    - Returns:         chữ ký dạng base64 string
    - Dùng Prehashed: input đã là hash, không hash lại lần nữa
    """
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(), password=None
    )
    signature = private_key.sign(
        bytes.fromhex(hash_hex),
        padding.PKCS1v15(),
        Prehashed(hashes.SHA256()),
    )
    return base64.b64encode(signature).decode("utf-8")


def crypto_verify(signature_b64: str, public_key_pem: str) -> str:
    """
    Giải mã chữ ký: signature + public key → hash gốc.
    - Công thức: Message = Signature^e mod n  (e = public exponent, n = modulus)
    - signature_b64:  chữ ký dạng base64
    - public_key_pem: public key dạng PEM
    - Returns:        hash gốc (hex 64 ký tự) nếu đúng key,
                      hoặc thông báo lỗi nếu key sai
    """
    try:
        public_key = serialization.load_pem_public_key(public_key_pem.encode())
        signature = base64.b64decode(signature_b64)

        # Raw RSA: m = s^e mod n
        pub_numbers = public_key.public_numbers()
        key_size = (pub_numbers.n.bit_length() + 7) // 8
        sig_int = int.from_bytes(signature, "big")
        decrypted_int = pow(sig_int, pub_numbers.e, pub_numbers.n)
        decrypted_bytes = decrypted_int.to_bytes(key_size, "big")

        # Parse PKCS#1 v1.5: tách hash 32 bytes từ kết quả giải mã
        sha256_prefix = bytes.fromhex("3031300d060960864801650304020105000420")
        idx = decrypted_bytes.index(b"\x00", 2)
        digest_and_hash: bytes = decrypted_bytes[idx + 1 :]  # pyre-ignore[6]

        if digest_and_hash.startswith(sha256_prefix):
            return digest_and_hash[len(sha256_prefix) :].hex()  # pyre-ignore[6]
        else:
            return "(key sai - không giải mã được)"
    except Exception:
        return "(key không hợp lệ)"


# =============================================================================
# WEB SERVER + API ROUTING
# =============================================================================

def _init_default_keys():
    """Nếu chưa có key mặc định, tự sinh một cặp khi khởi chạy."""
    global DEFAULT_PRIVATE_KEY, DEFAULT_PUBLIC_KEY
    if not DEFAULT_PRIVATE_KEY or not DEFAULT_PUBLIC_KEY:
        DEFAULT_PRIVATE_KEY, DEFAULT_PUBLIC_KEY = crypto_generate_keys()
        print("Đã tự sinh cặp key mặc định.")


class AppHandler(SimpleHTTPRequestHandler):
    """Handler xử lý file tĩnh (GET) và API backend (POST)."""

    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        data = json.loads(body.decode("utf-8")) if body else {}

        try:
            if self.path == "/api/hash":
                result = {"hash": crypto_hash(data.get("text", ""))}

            elif self.path == "/api/generate-keys":
                pri, pub = crypto_generate_keys()
                result = {"private_key": pri, "public_key": pub}

            elif self.path == "/api/default-keys":
                result = {"private_key": DEFAULT_PRIVATE_KEY, "public_key": DEFAULT_PUBLIC_KEY}

            elif self.path == "/api/sign":
                sig = crypto_sign(data.get("hash", ""), data.get("private_key", ""))
                result = {"signature": sig}

            elif self.path == "/api/verify":
                h = crypto_verify(data.get("signature", ""), data.get("public_key", ""))
                result = {"hash": h}

            else:
                self._send_json({"error": "Not found"}, 404)
                return

            self._send_json(result)
        except Exception as e:
            self._send_json({"error": str(e)}, 400)

    def _send_json(self, obj: dict, status: int = 200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(obj, ensure_ascii=False).encode("utf-8"))

    def log_message(self, format, *args):
        pass  # Tắt log request cho gọn terminal


def serve_app():
    PORT = 8000

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("", PORT), AppHandler) as httpd:
        print(f"Server đang chạy tại http://localhost:{PORT}")
        print("Ấn Ctrl+C để dừng server.")
        httpd.serve_forever()


if __name__ == "__main__":
    _init_default_keys()
    server_thread = threading.Thread(target=serve_app, daemon=True)
    server_thread.start()
    time.sleep(1)
    webbrowser.open("http://localhost:8000")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Đã đóng server.")
