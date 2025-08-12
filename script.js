// 1. 기본 설정
const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

// 캔버스 해상도 설정 (이미지의 원래 크기와 맞추는 것이 좋음)
canvas.width = 1920;
canvas.height = 1080;

// ✅ [수정] 1. 총 이미지 프레임 수 (실제 개수로 변경!)
const frameCount = 121; // 예시: 실제 프레임 수로 변경하세요!

// 이미지 경로를 생성하는 함수
const currentFrame = index => (
    `./images/0406.55.${index + 1}.png`
);

// 2. 이미지 미리 불러오기 (Preloading)
const images = [];
// GSAP이 조작할 가상의 객체
const frame = { current: 0 }; 

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// 3. GSAP ScrollTrigger로 애니메이션 설정
gsap.to(frame, {
    current: frameCount - 1,
    roundProps: "current",
    ease: "none",
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: true,
        onUpdate: render,
    }
});

// 4. 캔버스에 이미지 그리기 함수
function render() {
    // ✅ [수정됨] 현재 프레임 번호에 맞는 이미지를 배열에서 가져옵니다.
    const img = images[frame.current];
    
    // 이미지가 존재하고 로드가 완료되었을 때만 그립니다.
    if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

// ✅ [수정됨] 첫 번째 이미지가 로드되면 render 함수를 호출하여 캔버스에 첫 화면을 그립니다.
images[0].onload = render;
