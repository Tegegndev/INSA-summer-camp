const dunguzaUpload = document.getElementById('dunguzaUpload');
const userPhotoPreview = document.getElementById('userPhotoPreview');
const userPhotoPlaceholder = document.getElementById('userPhotoPlaceholder');
const uploadSpinner = document.getElementById('uploadSpinner');

const styleSelect = document.getElementById('styleSelect');
const stylePreview = document.getElementById('stylePreview');
const stylePreviewImg = document.getElementById('stylePreviewImg');
const stylePreviewName = document.getElementById('stylePreviewName');
const chooseImageBtn = document.getElementById('chooseImageBtn');
const generateBtn = document.querySelector('.generate-btn');
const downloadBtn = document.getElementById('downloadBtn');
const magicCard = document.getElementById('magicCard');
const compareView = document.getElementById('compareView');
const generationStatus = document.getElementById('generationStatus');
const generationText = document.getElementById('generationText');
const resultView = document.getElementById('resultView');
const resultImage = document.getElementById('resultImage');

const API_URL = 'https://gunguzameai5.lovable.app/api/public/tryon';
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

function setControlsDisabled(disabled) {
    chooseImageBtn.disabled = disabled;
    generateBtn.disabled = disabled;
    dunguzaUpload.disabled = disabled;
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

function showResult(imageUrl, downloadUrl) {
    hideLoading();
    resultImage.src = imageUrl;
    downloadBtn.dataset.url = downloadUrl || imageUrl;
    downloadBtn.href = '#';
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

    setControlsDisabled(true);
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
        showResult(data.imageUrl, data.downloadUrl);
    } catch (error) {
        showError(error.message || 'Generation failed. Please try again.');
    } finally {
        setControlsDisabled(false);
    }
});

downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = downloadBtn.dataset.url;
    if (!url) return;

    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

    try {
        const res = await fetch(url, { redirect: 'follow' });
        if (!res.ok) throw new Error('bad status');
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'dunguza-tryon.png';
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(blobUrl);
    } catch (_) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dunguza-tryon.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    }
});
