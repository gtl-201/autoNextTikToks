let isEnabled = false;

// Lấy trạng thái từ chrome.storage
chrome.storage.local.get(['isEnabled'], function(result) {
    isEnabled = result.isEnabled === true;
});

// Hàm mô phỏng việc nhấn phím Mũi tên xuống
function pressArrowDown() {
    if (!isEnabled) return; // Chỉ thực hiện khi chức năng được bật
    console.log('Nhấn phím Mũi tên xuống');
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40, // keyCode cho phím Mũi tên xuống
        which: 40,   // which cũng là 40 cho phím Mũi tên xuống
        bubbles: true // Cho phép sự kiện bong bóng lên DOM
    });

    const focusedElement = document.activeElement;

    if (focusedElement) {
        focusedElement.dispatchEvent(event);
    } else {
        console.warn('Không tìm thấy phần tử đang được focus để kích hoạt sự kiện.');
    }
}

// Tạo một MutationObserver để theo dõi các thay đổi trong DOM
const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return; // Chỉ thực hiện khi chức năng được bật
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'VIDEO') {
                    const video = node;
                    // Kiểm tra xem sự kiện 'ended' đã được thêm vào chưa
                    if (!video._hasEndedListener) {
                        video._hasEndedListener = true;
                        video.addEventListener('ended', () => {
                            console.log('Video đã kết thúc');
                            pressArrowDown();
                        });
                    }
                }
            });
        }
    });
});

// Bắt đầu quan sát sự thay đổi trong toàn bộ tài liệu
observer.observe(document.body, { childList: true, subtree: true });

// Lắng nghe thông báo từ popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.isEnabled !== undefined) {
        isEnabled = message.isEnabled;
    }
});
