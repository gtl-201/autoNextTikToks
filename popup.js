document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusText = document.getElementById('statusText');

    // Kiểm tra trạng thái hiện tại từ chrome.storage
    chrome.storage.local.get(['isEnabled'], function(result) {
        const isEnabled = result.isEnabled === true;
        toggleSwitch.checked = isEnabled;
        statusText.textContent = isEnabled ? 'Is now ON' : 'Is now OFF';
    });

    // Lắng nghe sự kiện thay đổi của toggleSwitch
    toggleSwitch.addEventListener('change', () => {
        const isChecked = toggleSwitch.checked;
        chrome.storage.local.set({ isEnabled: isChecked });
        statusText.textContent = isChecked ? 'Is now ON' : 'Is now OFF';

        // Gửi thông báo đến content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { isEnabled: isChecked });
        });
    });
});
