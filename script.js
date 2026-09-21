const form = document.querySelector('#applicationForm');
const photoInput = document.querySelector('#photo');
const photoPreview = document.querySelector('#photoPreview');
const fileName = document.querySelector('#fileName');
const photoError = document.querySelector('#photoError');
const removePhoto = document.querySelector('#removePhoto');
const confirmation = document.querySelector('#confirmation');

let photoUrl = '';

function clearPhoto() {
  if (photoUrl) {
    URL.revokeObjectURL(photoUrl);
  }

  photoUrl = '';
  photoInput.value = '';
  photoPreview.textContent = '◎';
  photoPreview.setAttribute('aria-label', 'No photograph selected');
  fileName.textContent = 'JPG, PNG, or WebP · max 5 MB';
  photoError.textContent = '';
  removePhoto.hidden = true;
}

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0];

  if (!file) {
    clearPhoto();
    return;
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
    clearPhoto();
    photoError.textContent =
      'Choose a JPG, PNG, or WebP image under 5 MB.';
    return;
  }

  if (photoUrl) {
    URL.revokeObjectURL(photoUrl);
  }

  photoUrl = URL.createObjectURL(file);

  photoPreview.innerHTML = `
    <img src="${photoUrl}" alt="Selected portrait preview">
  `;

  photoPreview.setAttribute(
    'aria-label',
    'Selected photograph preview'
  );

  fileName.textContent = file.name;
  removePhoto.hidden = false;
});

removePhoto.addEventListener('click', clearPhoto);

form.addEventListener('input', (e) => {
  if (e.target.matches('input, select, textarea')) {
    e.target.setAttribute(
      'aria-invalid',
      String(!e.target.validity.valid)
    );
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  confirmation.hidden = true;
  form.classList.add('was-validated');

  if (!form.checkValidity()) {
    const invalid = form.querySelector(':invalid');

    invalid?.focus();

    invalid?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    return;
  }

  confirmation.hidden = false;

  confirmation.focus();

  confirmation.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
});

document.querySelector('#printButton').addEventListener('click', () => {
  window.print();
});

window.addEventListener('beforeunload', () => {
  if (photoUrl) {
    URL.revokeObjectURL(photoUrl);
  }
});
