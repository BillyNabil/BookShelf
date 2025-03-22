let KoleksiBuku = JSON.parse(localStorage.getItem('KoleksiBuku')) || [];

const simpanKoleksi = () => localStorage.setItem('KoleksiBuku', JSON.stringify(KoleksiBuku));

const masukkanBukuKeRak = (event) => {
    event.preventDefault();
    const form = document.getElementById('bookForm');
    const entriBukuBaru = {
        id: Date.now(),
        title: form.bookFormTitle.value,
        author: form.bookFormAuthor.value,
        year: parseInt(form.bookFormYear.value, 10),
        isComplete: form.bookFormIsComplete.checked,
    };
    KoleksiBuku.push(entriBukuBaru);
    simpanKoleksi();
    tampilkanKoleksi();
    form.reset();
    tampilkanNotifikasi('Buku berhasil ditambahkan!');
};

const tampilkanKoleksi = (query = '') => {
    const rakBelumDibaca = document.getElementById('incompleteBookList');
    const rakSudahDibaca = document.getElementById('completeBookList');
    rakBelumDibaca.innerHTML = '';
    rakSudahDibaca.innerHTML = '';

    KoleksiBuku.filter(buku => buku.title.toLowerCase().includes(query.toLowerCase()))
        .forEach(buku => {
            const elemenBuku = buatElemenBuku(buku);
            (buku.isComplete ? rakSudahDibaca : rakBelumDibaca).appendChild(elemenBuku);
        });
};

const buatElemenBuku = (buku) => {
    const elemenBuku = document.createElement('div');
    elemenBuku.setAttribute('data-bookid', buku.id);
    elemenBuku.setAttribute('data-testid', 'bookItem');
    elemenBuku.innerHTML = `
        <h3 data-testid="bookItemTitle">${buku.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${buku.author}</p>
        <p data-testid="bookItemYear">Tahun: ${buku.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton"> ${buku.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
            <button data-testid="bookItemDeleteButton"> Hapus Buku</button>
            <button data-testid="bookItemEditButton"> Edit Buku</button>
        </div>
    `;
    elemenBuku.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => ubahStatusBuku(buku.id));
    elemenBuku.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => hapusBuku(buku.id));
    elemenBuku.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => editBuku(buku.id));
    return elemenBuku;
};

const ubahStatusBuku = (bookId) => {
    const buku = KoleksiBuku.find(b => b.id === bookId);
    if (buku) {
        buku.isComplete = !buku.isComplete;
        simpanKoleksi();
        tampilkanKoleksi();
        tampilkanNotifikasi(buku.isComplete ? 'Buku ditandai sebagai selesai dibaca!' : 'Buku ditandai sebagai belum selesai dibaca!');
    }
};

const hapusBuku = (bookId) => {
    KoleksiBuku = KoleksiBuku.filter(b => b.id !== bookId);
    simpanKoleksi();
    tampilkanKoleksi();
    tampilkanNotifikasi('Buku berhasil dihapus!');
};

const editBuku = (bookId) => {
    const buku = KoleksiBuku.find(b => b.id === bookId);
    if (buku) {
        const form = document.getElementById('bookForm');
        form.bookFormTitle.value = buku.title;
        form.bookFormAuthor.value = buku.author;
        form.bookFormYear.value = buku.year;
        form.bookFormIsComplete.checked = buku.isComplete;
        const tombolSubmit = form.bookFormSubmit;
        tombolSubmit.textContent = 'Simpan Perubahan';
        tombolSubmit.onclick = (event) => {
            event.preventDefault();
            buku.title = form.bookFormTitle.value;
            buku.author = form.bookFormAuthor.value;
            buku.year = parseInt(form.bookFormYear.value, 10);
            buku.isComplete = form.bookFormIsComplete.checked;
            simpanKoleksi();
            tampilkanKoleksi();
            form.reset();
            tombolSubmit.textContent = 'Masukkan Buku ke rak';
            tombolSubmit.onclick = masukkanBukuKeRak;
            tampilkanNotifikasi('Buku berhasil diperbarui!');
        };
    }
};

const tampilkanNotifikasi = (message, type = 'success') => {
    const kontainerNotifikasi = document.getElementById('notificationContainer');
    const notifikasi = document.createElement('div');
    notifikasi.className = `notification ${type}`;
    notifikasi.textContent = message;
    notifikasi.classList.add('fade-in');
    kontainerNotifikasi.appendChild(notifikasi);
    setTimeout(() => {
        notifikasi.classList.remove('fade-in');
        notifikasi.classList.add('fade-out');
        notifikasi.addEventListener('transitionend', () => {
            kontainerNotifikasi.removeChild(notifikasi);
        });
    }, 3000);
};

document.getElementById('bookForm').addEventListener('submit', masukkanBukuKeRak);
document.getElementById('searchBook').addEventListener('submit', (event) => {
    event.preventDefault();
    tampilkanKoleksi(document.getElementById('searchBookTitle').value);
});

tampilkanKoleksi();