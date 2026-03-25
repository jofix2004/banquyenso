// 1. Tailwind UI Config
window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                bgDark: '#0a0a0c',
                bgSlide: '#121214',
                accent: '#10b981', /* Emerald 500 */
                textMain: '#f4f4f5',
                textMuted: '#a1a1aa'
            }
        }
    }
};

// 2. Slide Navigation & Animation Engine
window.currentSlide = 1;
window.isAnimating = false;
window.totalSlides = 0;
window.isModalOpen = false;

function updateSlides() {
    if(window.isAnimating) return;
    window.isAnimating = true;

    for(let i=1; i<=window.totalSlides; i++) {
        const slide = document.getElementById(`slide-${i}`);
        if(!slide) continue;

        if (i === window.currentSlide) {
            slide.classList.add('slide-active');
            runReveals(slide);

            // Trigger Chart Specific
            if (slide.querySelector('#chart-bar-1')) {
                setTimeout(() => {
                    const bar1 = document.getElementById('chart-bar-1');
                    const bar2 = document.getElementById('chart-bar-2');
                    if(bar1) bar1.style.width = '57%';
                    if(bar2) bar2.style.width = '83%';
                }, 500);
                setTimeout(() => {
                    const detail = document.getElementById('chart-detail');
                    if(detail) detail.style.opacity = '1';
                }, 1800);
            }
        } else {
            slide.classList.remove('slide-active');
            resetReveals(slide);
            if (slide.querySelector('#chart-bar-1')) {
                const chart1 = document.getElementById('chart-bar-1');
                const chart2 = document.getElementById('chart-bar-2');
                const detail = document.getElementById('chart-detail');
                if(chart1) chart1.style.width = '0%';
                if(chart2) chart2.style.width = '0%';
                if(detail) detail.style.opacity = '0';
            }
        }
    }
    
    // Update Page Indicator
    const indicator = document.getElementById('indicator');
    if(indicator) {
        const currentStr = window.currentSlide < 10 ? '0' + window.currentSlide : window.currentSlide;
        const totalStr = window.totalSlides < 10 ? '0' + window.totalSlides : window.totalSlides;
        indicator.textContent = `${currentStr}/${totalStr}`;
    }
    
    // Update Chapter Progress Bar if exists
    const currentSlideEl = document.getElementById(`slide-${window.currentSlide}`);
    if(currentSlideEl && currentSlideEl.hasAttribute('data-chapter')) {
        const chapter = currentSlideEl.getAttribute('data-chapter');
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach(step => {
            const stepNum = step.getAttribute('data-step');
            if (stepNum === chapter) {
                step.className = "flex items-center gap-4 progress-step text-accent font-bold";
                step.style.opacity = '1';
                step.style.textDecoration = 'none';
            } else if (parseInt(stepNum) < parseInt(chapter)) {
                step.className = "flex items-center gap-4 progress-step text-zinc-500 line-through decoration-zinc-800";
                step.style.opacity = '0.5';
            } else {
                step.className = "flex items-center gap-4 progress-step text-zinc-500";
                step.style.opacity = '0.5';
                step.style.textDecoration = 'none';
            }
        });
    }

    document.dispatchEvent(new CustomEvent("SlideChanged", { detail: { currentIndex: window.currentSlide } }));

    setTimeout(() => { window.isAnimating = false; }, 800);
}

function runReveals(slide) {
    const reveals = slide.querySelectorAll('[class*="reveal-"]');
    reveals.forEach((el, index) => {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                el.style.opacity = '1';
                if(!el.className.includes('translate-x-')) {
                    el.style.transform = 'translateY(0)';
                } else {
                    el.style.transform = 'translate(0, 0)';
                }
            }, 50 + (index * 150));
        });
    });
}

function resetReveals(slide) {
    const reveals = slide.querySelectorAll('[class*="reveal-"]');
    reveals.forEach(el => { el.style.opacity = '0'; });
}

window.nextSlide = function(dir) {
    if (window.isModalOpen) return;
    let n = window.currentSlide + dir;
    if(n < 1) n = 1;
    if(n > window.totalSlides) n = window.totalSlides;
    if(n !== window.currentSlide) {
        window.currentSlide = n;
        updateSlides();
    }
}

/* ========================================= */
/* MODAL GO TO SLIDE                         */
/* ========================================= */
function openGoToModal() {
    let modal = document.getElementById('goto-modal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'goto-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none hidden';
        modal.innerHTML = `
            <div class="bg-zinc-900 border border-zinc-700 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center transform scale-95 transition-transform duration-300" id="goto-modal-box">
                <i class="ph-bold ph-cards text-5xl text-accent mb-6"></i>
                <h3 class="text-white font-bold text-2xl mb-8">Chuyển Trang Nhanh</h3>
                <div class="flex items-center gap-4 mb-2">
                    <input type="number" id="goto-input" min="1" class="bg-zinc-800 border-2 border-zinc-600 text-accent text-center text-4xl font-mono p-4 w-32 rounded-2xl focus:outline-none focus:border-accent shadow-inner transition-colors">
                    <span class="text-zinc-500 font-mono text-3xl">/ <span id="goto-max"></span></span>
                </div>
                <div class="mt-8 text-zinc-500 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest font-mono">
                    <span class="text-white font-bold">ENTER</span> Chuyển | <span class="text-white font-bold">ESC</span> Đóng
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeGoToModal();
        });

        const input = modal.querySelector('#goto-input');
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                let val = parseInt(input.value);
                if(val && val > 0 && val <= window.totalSlides) {
                    window.currentSlide = val;
                    updateSlides();
                    closeGoToModal();
                } else {
                    input.classList.add('border-rose-500', 'text-rose-500');
                    setTimeout(() => input.classList.remove('border-rose-500', 'text-rose-500'), 500);
                }
            }
            if(e.key === 'Escape') closeGoToModal();
        });
    }

    document.getElementById('goto-max').textContent = window.totalSlides;
    modal.classList.remove('hidden');
    modal.classList.remove('pointer-events-none');
    
    // Show animation
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('goto-modal-box').classList.remove('scale-95');
        const input = document.getElementById('goto-input');
        input.value = window.currentSlide;
        input.focus();
        input.select();
    });
    window.isModalOpen = true;
}

function closeGoToModal() {
    const modal = document.getElementById('goto-modal');
    if(modal) {
        modal.classList.add('opacity-0');
        document.getElementById('goto-modal-box').classList.add('scale-95');
        modal.classList.add('pointer-events-none');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
    window.isModalOpen = false;
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    window.totalSlides = document.querySelectorAll('.slide').length;
    updateSlides();

    // Make indicator clickable
    const indicator = document.getElementById('indicator');
    if(indicator) {
        indicator.classList.add('cursor-pointer', 'hover:text-accent', 'transition-colors');
        indicator.title = 'Bấm phím G hoặc click để chọn trang';
        indicator.addEventListener('click', openGoToModal);
    }
});

// Keybinds Setup
document.addEventListener('keydown', (e) => {
    if (window.isModalOpen) {
        if (e.key === 'Escape') closeGoToModal();
        return; // Dừng lại ở đây khi đang mở hộp thoại
    }

    if (e.key === 'ArrowRight' || e.key === 'Space') window.nextSlide(1);
    if (e.key === 'ArrowLeft') window.nextSlide(-1);
    // Nhấn phím 'G' mọc Modal Go
    if (e.key.toLowerCase() === 'g') openGoToModal();
});
