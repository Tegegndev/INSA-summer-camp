const dunguzaUpload = document.getElementById('dunguzaUpload');
const userPhotoPreview = document.getElementById('userPhotoPreview');
const userPhotoPlaceholder = document.getElementById('userPhotoPlaceholder');
const uploadSpinner = document.getElementById('uploadSpinner');

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
        userPhotoPreview.src = event.target.result;
        userPhotoPreview.style.display = 'block';
    };
    reader.onerror = () => {
        uploadSpinner.style.display = 'none';
        userPhotoPlaceholder.style.display = 'block';
        alert('Could not read the image file.');
    };
    reader.readAsDataURL(file);
});
