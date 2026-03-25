# GitHub Pages Setup For `anigastudio.space/banquyenso`

## Da chuan bi san

Bo file deploy rieng cho GitHub Pages nam trong thu muc `docs/`:

- `docs/index.html`
- `docs/presentation_chu_ky_so.html`
- `docs/presentation_core.js`
- `docs/presentation_styles.css`
- `docs/.nojekyll`

GitHub Pages co the publish truc tiep tu `main` + `/docs` ma khong anh huong den `index.html` goc dang dung cho demo local.

## Cach deploy de ra dung duong dan `/banquyenso`

1. Tao repository GitHub ten `banquyenso`.
2. Day toan bo thu muc nay len branch `main`.
3. Vao `Settings` -> `Pages`.
4. O muc `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
5. Luu lai va doi Pages build xong.

Sau khi xong, URL mac dinh se co dang:

- `https://<username>.github.io/banquyenso/`

Khi gan custom domain xong, nen uu tien dung:

- `https://anigastudio.space/banquyenso/`

Thay vi `http://...`

## Luu y rat quan trong ve custom domain

Neu ban muon URL cuoi cung la:

- `https://anigastudio.space/banquyenso/`

thi **khong** nen set custom domain `anigastudio.space` trong repository `banquyenso`.

Thay vao do:

1. Domain goc `anigastudio.space` can duoc gan cho **user/org GitHub Pages site** cua tai khoan.
2. Repository `banquyenso` se duoc phuc vu duoi dang **project site** tai duong dan con:
   - `https://anigastudio.space/banquyenso/`

Noi ngan gon:

- User/org site giu domain goc: `anigastudio.space`
- Project site ten `banquyenso` xuat hien o: `/banquyenso/`

## Khi nao moi set custom domain trong repo nay?

Chi set custom domain ngay trong repository `banquyenso` neu ban muon repo nay chay tren:

- `https://anigastudio.space/`

hoac:

- `https://banquyenso.anigastudio.space/`

Chu **khong phai** `https://anigastudio.space/banquyenso/`.

## Vi sao khong co file `CNAME`?

Mình co y **khong** tao file `CNAME` trong bo deploy nay.

Ly do:

- Neu ban gan `CNAME` truc tiep cho project repo, GitHub Pages se co xu huong map repo nay vao root domain hoac subdomain rieng
- Dieu do khong phu hop voi muc tieu giu duong dan con `/banquyenso/`

## DNS goi y

Neu `anigastudio.space` chua tro den GitHub Pages, ban can cau hinh DNS cho **user/org Pages site**:

- Apex domain `anigastudio.space`: dung `A` / `ALIAS` / `ANAME` theo huong dan GitHub Pages
- `www.anigastudio.space`: co the tro `CNAME` ve `<username>.github.io`

## File entry se mo cai gi?

GitHub Pages se mo:

- `docs/index.html`

Hien tai file nay da duoc copy tu:

- `presentation_chu_ky_so.html`

nen vao `/banquyenso/` se hien thi truc tiep slide presentation.
