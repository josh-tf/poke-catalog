function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function attachSlugAndCheck(titleInput, idInput) {
    let manual = false;
    const feedback = idInput.parentElement.querySelector('.id-feedback');
    if (!feedback) {
        return;
    }

    idInput.addEventListener('input', () => {
        manual = true;
    });

    titleInput.addEventListener('input', () => {
        if (!manual) {
            idInput.value = slugify(titleInput.value);
        }
    });

    idInput.addEventListener('blur', () => checkId(idInput, feedback));
}

async function checkId(idInput, feedback) {
    const id = idInput.value.trim();
    if (!id) {
        feedback.textContent = '';
        return;
    }

    try {
        const res = await fetch(`/check-id/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.exists) {
            feedback.textContent = 'ID already exists';
            feedback.classList.add('text-danger');
            feedback.classList.remove('text-success');
        } else {
            feedback.textContent = 'ID available';
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
        }
    } catch (err) {
        // eslint-disable-next-line
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const singleTitle = document.getElementById('title-input');
    const singleId = document.getElementById('id-input');
    if (singleTitle && singleId) {
        attachSlugAndCheck(singleTitle, singleId);
    }

    document.querySelectorAll('.bulk-item').forEach((item) => {
        const title = item.querySelector('.title-input');
        const id = item.querySelector('.id-input');
        if (title && id) {
            attachSlugAndCheck(title, id);
        }
    });
});
