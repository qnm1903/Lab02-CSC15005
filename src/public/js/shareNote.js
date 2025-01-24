const noteByNoteID = JSON.parse(document.getElementById('notes-data').textContent);
const sharedNoteContent = document.getElementById('shared-note-content');

const displayNoteContent = () => {
    const pdfBlob = new Blob([new Uint8Array(noteByNoteID.content.data)], { type: 'application/pdf' });
    const pdfURL = URL.createObjectURL(pdfBlob);
    sharedNoteContent.innerHTML = `    <div id="header-wrapper">
        <a href="/note" class="home-button">
        <i class="fas fa-home"></i>Trở về trang ghi chú
        </a>
        <h3>Bản chia sẻ của ghi chú ${noteByNoteID.title}</h3>
    </div>
    <embed src="${pdfURL}" type="application/pdf" width="100%" height="500px">`;
}

displayNoteContent();