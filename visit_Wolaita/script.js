const dunguzaUpload = document.getElementById('dunguzaUpload');
const userPhotoPreview = document.getElementById('userPhotoPreview');
const userPhotoPlaceholder = document.getElementById('userPhotoPlaceholder');
const uploadSpinner = document.getElementById('uploadSpinner');

const styleSelect = document.getElementById('styleSelect');
const stylePreview = document.getElementById('stylePreview');
const stylePreviewImg = document.getElementById('stylePreviewImg');
const stylePreviewName = document.getElementById('stylePreviewName');
const generateBtn = document.querySelector('.generate-btn');
const magicCard = document.getElementById('magicCard');
const compareView = document.getElementById('compareView');
const generationStatus = document.getElementById('generationStatus');
const generationText = document.getElementById('generationText');
const resultView = document.getElementById('resultView');
const resultImage = document.getElementById('resultImage');
const resultLabel = document.getElementById('resultLabel');

const API_URL = 'https://dunguzameai.lovable.app/api/public/tryon';
const LOADING_MESSAGES = [
    'Clothing you up...',
    'Dressing you in Wolaita style...',
    'AI is weaving your garment...',
    'Adding the final touches...',
    'Almost there, you look stunning...',
];

let uploadedDataUrl = null;
let loadingMessageIndex = 0;
let loadingMessageTimer = null;

dunguzaUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please choose an image file.');
        return;
    }

    userPhotoPreview.style.display = 'none';
    userPhotoPlaceholder.style.display = 'none';
    uploadSpinner.style.display = 'block';

    const reader = new FileReader();
    reader.onload = (event) => {
        uploadSpinner.style.display = 'none';
        uploadedDataUrl = event.target.result;
        userPhotoPreview.src = uploadedDataUrl;
        userPhotoPreview.style.display = 'block';
    };
    reader.onerror = () => {
        uploadSpinner.style.display = 'none';
        userPhotoPlaceholder.style.display = 'block';
        alert('Could not read the image file.');
    };
    reader.readAsDataURL(file);
});

styleSelect.addEventListener('change', () => {
    const selected = styleSelect.options[styleSelect.selectedIndex];
    const imgUrl = selected.getAttribute('data-img');
    stylePreviewImg.src = imgUrl;
    stylePreviewImg.alt = selected.text;
    stylePreviewName.textContent = selected.text;
    stylePreview.classList.add('has-selection');
});

function rotateLoadingMessage() {
    loadingMessageIndex = (loadingMessageIndex + 1) % LOADING_MESSAGES.length;
    generationText.textContent = LOADING_MESSAGES[loadingMessageIndex];
}

function showLoading() {
    compareView.style.display = 'none';
    resultView.style.display = 'none';
    generationStatus.style.display = 'flex';
    loadingMessageIndex = 0;
    generationText.textContent = LOADING_MESSAGES[0];
    loadingMessageTimer = setInterval(rotateLoadingMessage, 2500);
}

function hideLoading() {
    generationStatus.style.display = 'none';
    if (loadingMessageTimer) {
        clearInterval(loadingMessageTimer);
        loadingMessageTimer = null;
    }
}

function showResult(imageUrl, garmentName) {
    hideLoading();
    resultImage.src = imageUrl;
    resultLabel.textContent = 'You in ' + garmentName;
    resultView.style.display = 'flex';
    compareView.style.display = 'none';
}

function showError(message) {
    hideLoading();
    alert(message);
    compareView.style.display = 'flex';
}

generateBtn.addEventListener('click', async () => {
    if (!uploadedDataUrl) {
        alert('Please upload your photo first.');
        return;
    }

    const garmentId = styleSelect.value;
    if (!garmentId) {
        alert('Please select a style.');
        return;
    }

    const garmentName = styleSelect.options[styleSelect.selectedIndex].text;

    generateBtn.disabled = true;
    showLoading();

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ garmentId, personImage: uploadedDataUrl }),
        });

        if (!res.ok) {
            let message = 'Something went wrong. Please try again.';
            try {
                const err = await res.json();
                if (err && err.error) message = err.error;
            } catch (_) {}
            throw new Error(message);
        }

        const data = await res.json();
        showResult(data.imageUrl, garmentName);
    } catch (error) {
        showError(error.message || 'Generation failed. Please try again.');
    } finally {
        generateBtn.disabled = false;
    }
});
