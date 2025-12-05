document.addEventListener('DOMContentLoaded', function() {
    // Menu data (Dapat diubah oleh Admin)
    let menuItems = [
        {
            id: 1,
            name: "Kolo",
            category: "makanan",
            price: 43000,
            image: "images/Kolo.png",
            description: "Nasi yang dimasak dalam bambu, menghasilkan aroma harum dengan tekstur pulen dan sedikit smoky.",
            isSpecial: true
        },
        {
            id: 2,
            name: "Se'i Daging",
            category: "makanan",
            price: 87500,
            image: "images/Se'i Daging.png",
            description: "Se'i Daging adalah daging sapi atau babi yang diasap dengan cara khas Flores. Daging dimarinasi dengan rempah-rempah tradisional kemudian diasap menggunakan kayu khusus yang memberikan aroma dan rasa unik.",
            isSpecial: true
        },
        {
            id: 3,
            name: "Kompiang",
            category: "makanan",
            price: 25000,
            image: "images/Kompiang.jpg",
            description: "Roti panggang khas Manggarai (populer di Singkawang) berbentuk bulat pipih, bertekstur padat, biasanya ditaburi wijen..",
            isSpecial: true
        },
        {
            id: 4,
            name: "Jagung Bose",
            category: "makanan",
            price: 55000,
            image: "images/Jagung Bose.png",
            description: "Jagung Bose adalah makanan tradisional Flores yang terbuat dari jagung manis yang direbus dengan kacang hijau dan kelapa parut. Memiliki tekstur lembut dan rasa manis-gurih yang seimbang.",
            isSpecial: false
        },
        {
            id: 5,
            name: "Jagung titi",
            category: "makanan",
            price: 35000,
            image: "images/Jagung titi.png",
            description: "Camilan khas Flores berupa pipihan jagung yang disangrai lalu dititi (ditumbuk ringan) hingga gepeng dan renyah.",
            isSpecial: false
        },
        {
            id: 6,
            name: "Rumpu-Rampe",
            category: "makanan",
            price: 20000,
            image: "images/Rumpu-Rampe.png",
            description: "Hidangan khas Flores berupa tumisan sayur campur (biasanya daun pepaya muda dan bunga pepaya) yang diolah dengan bumbu sederhana hingga menghasilkan rasa gurih dan sedikit pahit.",
            isSpecial: false
        },
        {
            id: 7,
            name: "Kopi Arabika Flores",
            category: "minuman",
            price: 30000,
            image: "images/Kopi Arabika.jpeg",
            description: "Kopi arabika premium yang ditanam di dataran tinggi Flores. Memiliki cita rasa yang kaya dengan sentuhan buah dan aftertaste yang panjang.",
            isSpecial: false
        },
        {
            id: 8,
            name: "Kue Satu",
            category: "makanan",
            price: 15000,
            image: "images/Kue Satu.jpeg",
            description: "Kue kering tradisional dari tepung kacang hijau manis yang dipadatkan, bertekstur rapuh dan mudah hancur di mulut.",
            isSpecial: false
        }
    ];

    // --- LOGIC: Membatasi spesial menjadi hanya 3 item pertama ---
    let specialCount = 0;
    menuItems = menuItems.map(item => {
        if (item.isSpecial) {
            if (specialCount < 3) {
                specialCount++;
                return item;
            } else {
                return { ...item, isSpecial: false };
            }
        }
        return item;
    });
    
    // Data Tambahan untuk Ulasan (Simulasi)
    const reviewsData = [
        { name: "Bapak Wayan S.", rating: 5, comment: "Se'i Dagingnya luar biasa! Dagingnya empuk, aroma asapnya pas, dan sambal ricanya benar-benar otentik. Wajib coba bagi wisatawan!", ordered: "Se'i Daging, Kopi Arabika" },
        { name: "Ibu Maria C.", rating: 4, comment: "Muko Loto sangat unik, rasa manis dan gurihnya seimbang. Suasananya nyaman, meskipun Kopi Flores-nya agak strong untuk saya. Tapi secara keseluruhan, pengalaman kuliner yang hebat.", ordered: "Muko Loto, Kopi Arabika Flores" },
        { name: "Diki R.", rating: 5, comment: "Saya suka Jagung Bose, rasanya tradisional sekali. Pelayanan stafnya cepat dan sigap, selalu menawarkan bantuan. Tempatnya bersih dan cocok untuk makan bersama keluarga.", ordered: "Jagung Bose, Susu Kelapa Muda" },
        { name: "Jenny F.", rating: 4, comment: "Ikan Bakar Rica pedasnya pas di lidah! Ikan segar dengan bumbu meresap sempurna. Mungkin perlu menambah variasi lauk pendamping sayur.", ordered: "Ikan Bakar Rica" },
        { name: "Rizky P.", rating: 5, comment: "Pelayanan terbaik! Sopi-nya benar-benar menghangatkan, cocok buat malam di pegunungan. Menu makanan tradisionalnya patut diacungi jempol.", ordered: "Sopi, Ubi Jalar Bakar" }
    ];

    // State
    let cart = [];
    let currentFilter = 'all';
    let selectedMenuItem = null;
    let nextItemId = Math.max(...menuItems.map(item => item.id)) + 1; // Untuk ID menu baru

    // AMBIL DARI PHP/HTML
    const isAdmin = document.body.dataset.isAdmin === 'true';
    let currentSection = document.body.dataset.initialSection || 'home';

    // DOM Elements
    const body = document.body;
    const menuGrid = document.getElementById('menuGrid');
    const cartItems = document.getElementById('cartItems');
    const cartCountHeader = document.getElementById('cartCountHeader');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const menuModal = document.getElementById('menuModal');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const searchInput = document.getElementById('searchInput');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const sectionTitle = document.getElementById('sectionTitle');
    const contentMainTitle = document.getElementById('contentMainTitle');
    const sectionHeader = document.querySelector('.section-header');
    const filterControls = document.querySelector('.filter-controls');

    // NEW DOM Elements for View Management
    const cartBtnHeader = document.getElementById('cartBtnHeader');
    const contentMenuView = document.getElementById('contentMenuView');
    const contentCartView = document.getElementById('contentCartView');
    const contentInfoView = document.getElementById('contentInfoView');
    const contentLoginView = document.getElementById('contentLoginView');
    const contentManageMenuView = document.getElementById('contentManageMenuView'); // **BARU**

    // ELEMEN BARU UNTUK NAVIGASI ADMIN
    const navAdminDashboard = document.getElementById('navAdminDashboard');
    const navAdminManageMenu = document.getElementById('navAdminManageMenu'); // **BARU**
    const navAdminUlasan = document.getElementById('navAdminUlasan'); // **BARU**
    const navAdminLogout = document.getElementById('navAdminLogout');
    const navLogin = document.getElementById('navLogin');
    
    // Initialize
    updateUIForSection(currentSection);
    updateCart();
    setupEventListeners();
    
    // **PERBAIKAN 1: Tampilkan/Sembunyikan Navigasi Admin**
    if (isAdmin) {
        navLogin?.classList.add('hidden');
        navAdminDashboard?.classList.remove('hidden');
        navAdminManageMenu?.classList.remove('hidden'); // Tampilkan Kelola Menu
        navAdminUlasan?.classList.remove('hidden'); // Tampilkan Ulasan
        navAdminLogout?.classList.remove('hidden');
    } else {
        navLogin?.classList.remove('hidden');
        navAdminDashboard?.classList.add('hidden');
        navAdminManageMenu?.classList.add('hidden');
        navAdminUlasan?.classList.add('hidden');
        navAdminLogout?.classList.add('hidden');
    }


    // Helper: Price formatting
    function formatPrice(price) {
        return price.toLocaleString('id-ID');
    }

    // Helper: Notification display
    function showNotification(message) {
        notificationText.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 5px;"></i> ${message}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // --- Core Functions: Menu Rendering and Navigation ---

    /**
     * Helper function to render star ratings.
     */
    function renderStarRating(rating) {
        let stars = '';
        const starColor = '#FFD700';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += `<i class="fas fa-star" style="color: ${starColor};"></i>`;
            } else {
                stars += `<i class="far fa-star" style="color: ${starColor};"></i>`;
            }
        }
        return stars;
    }

    // NEW HELPER: Calculate Dashboard Data
    function getDashboardData() {
        const totalItems = menuItems.length;
        const foodCount = menuItems.filter(item => item.category === 'makanan').length;
        const drinkCount = totalItems - foodCount;
        const specialCount = menuItems.filter(item => item.isSpecial).length;

        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = (reviewsData.length > 0 ? totalRating / reviewsData.length : 0).toFixed(1);
        const totalReviews = reviewsData.length;

        const maxPriceItem = menuItems.reduce((max, item) => (item.price > max.price ? item : max), menuItems[0] || {name: 'N/A', price: 0});

        return {
            totalItems,
            foodCount,
            drinkCount,
            specialCount,
            avgRating,
            totalReviews,
            maxPriceItem
        };
    }

    // NEW HELPER: Add New Menu Item
    function addNewMenuItem(name, category, price, description, isSpecial) {
        const newItem = {
            id: nextItemId++,
            name: name,
            category: category,
            price: parseFloat(price),
            image: `https://picsum.photos/seed/${name.replace(/\s/g, '-')}/300/200.jpg`, // Placeholder image
            description: description,
            isSpecial: isSpecial
        };
        menuItems.push(newItem);
        showNotification(`Menu **${name}** berhasil ditambahkan!`);
        // Setelah menambah, kembali ke Dashboard
        updateUIForSection('dashboard');
        return newItem;
    }


    function getContentForSection(section) {
        // Mendapatkan warna dari CSS
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#2c3e50';
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color') || '#e67e22';
        const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white') || '#ffffff';
        const lightGray = getComputedStyle(document.documentElement).getPropertyValue('--light-gray') || '#f4f6f9';
        const darkGray = getComputedStyle(document.documentElement).getPropertyValue('--dark-gray') || '#7f8c8d';

        switch(section) {
            case 'home':
                // Konten Home (Tidak berubah signifikan)
                return {
                    title: 'Selamat Datang di Flores Culinary',
                    contentTitle: 'Jelajahi Cita Rasa Otentik Nusa Tenggara Timur',
                    isMenuPage: false,
                    isLogin: false,
                    isHome: true,
                    content: `
                        <div class="hero-section" style="background: url('https://picsum.photos/seed/flores-view/1200/400.jpg') no-repeat center center/cover; padding: 60px 40px; border-radius: 12px; margin-bottom: 30px; text-shadow: 0 1px 5px rgba(0,0,0,0.5);">
                            <h1 style="color: ${whiteColor}; font-size: 2.5rem; margin-bottom: 10px;">Flores Culinary: Tradisi di Setiap Gigitan</h1>
                            <p style="color: ${whiteColor}; font-size: 1.2rem;">Kami menghadirkan cita rasa sejati dari Flores. Semua bahan kami segar, lokal, dan disiapkan dengan cinta sesuai resep nenek moyang.</p>
                        </div>

                        <div class="info-card" style="display: flex; gap: 30px; background-color: ${whiteColor}; padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="flex: 1;">
                                <h3>Mengapa Memilih Kami?</h3>
                                <p>Kami bukan sekadar restoran, kami adalah duta budaya. Kami fokus pada **kelestarian resep dan bahan baku lokal**. Dengan makan di sini, Anda mendukung petani dan perajin Flores.</p>
                                <ul style="list-style-type: none; padding-left: 0; margin-top: 15px;">
                                    <li><i class="fas fa-seedling" style="color: ${secondaryColor}; margin-right: 8px;"></i> Bahan Baku Lokal Organik</li>
                                    <li><i class="fas fa-fire" style="color: ${secondaryColor}; margin-right: 8px;"></i> Metode Memasak Tradisional (Se'i Asap Kayu)</li>
                                    <li><i class="fas fa-heart" style="color: ${secondaryColor}; margin-right: 8px;"></i> Pelayanan Ramah Keluarga</li>
                                </ul>
                                <button onclick="document.querySelector('.nav-link[data-section=\'menu\']').click()" 
                                    style="background-color: var(--accent-color); color: var(--white); padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-top: 20px; font-weight: 600; transition: background-color 0.3s;">
                                    <i class="fas fa-utensils"></i> Lihat Semua Menu
                                </button>
                            </div>
                            <div style="flex: 1;">
                                <img src="https://picsum.photos/seed/flores-chef/400/250.jpg" alt="Chef Flores" style="width: 100%; height: auto; border-radius: 8px; object-fit: cover; max-height: 250px;">
                            </div>
                        </div>
                    `,
                };
            case 'menu':
                return {
                    title: 'Semua Menu',
                    contentTitle: 'Jelajahi Kuliner Flores',
                    isMenuPage: true,
                    isLogin: false
                };
            case 'cart':
                return {
                    title: 'Ringkasan Pesanan',
                    contentTitle: 'Keranjang',
                    isMenuPage: false,
                    isLogin: false
                };
            case 'ulasan':
                // Konten Ulasan (Halaman Publik/Admin)
                const reviewCardsHtml = reviewsData.map(review => `
                    <div class="review-card" style="min-width: 320px; max-width: 320px; background-color: ${whiteColor}; padding: 25px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-left: 5px solid ${secondaryColor}; flex-shrink: 0;">
                        <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed ${lightGray}; padding-bottom: 10px;">
                            <h4 style="margin: 0; color: ${primaryColor}; font-size: 1.1rem;">${review.name}</h4>
                            <div class="rating-stars">${renderStarRating(review.rating)}</div>
                        </div>
                        <p style="font-style: italic; color: ${darkGray}; line-height: 1.6; height: 100px; overflow: hidden; text-overflow: ellipsis;">"${review.comment}"</p>
                        <small style="display: block; text-align: right; color: #999; font-size: 0.85rem; margin-top: 10px;">Dipesan: ${review.ordered}</small>
                    </div>
                `).join('');

                const totalRatingUlasan = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                const avgRatingUlasan = (reviewsData.length > 0 ? totalRatingUlasan / reviewsData.length : 0).toFixed(1);

                return {
                    title: 'Ulasan Pelanggan 💬',
                    contentTitle: 'Apa Kata Mereka Tentang Kami?',
                    isMenuPage: false,
                    isLogin: false,
                    content: `
                        <div class="reviews-wrapper" style="overflow-x: auto; padding: 15px 0;">
                            <div class="reviews-container" style="display: flex; gap: 25px; padding-bottom: 10px;">
                                ${reviewCardsHtml}
                            </div>
                        </div>
                        
                        <div class="info-card" style="text-align: center; margin-top: 30px; background-color: ${secondaryColor}; color: ${whiteColor}; padding: 25px; border-radius: 12px;">
                            <h3 style="margin-top: 0; color: ${whiteColor}; font-size: 1.5rem;">Rata-rata Rating: ${avgRatingUlasan}/5.0 (${reviewsData.length} Ulasan)</h3>
                            <p style="margin-bottom: 0;">Terima kasih atas semua ulasan! Kami berkomitmen untuk terus meningkatkan kualitas dan pelayanan kami.</p>
                        </div>
                    `,
                };
            case 'dashboard': 
                if (!isAdmin) {
                    return getContentForSection('login');
                }
                const dashboardData = getDashboardData();
                return {
                    title: 'Dashboard Admin 📊',
                    contentTitle: 'Ringkasan Restoran',
                    isMenuPage: false,
                    isLogin: false,
                    content: `
                        <div class="dashboard-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                            
                            <div class="stat-card" style="background-color: ${whiteColor}; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-bottom: 4px solid ${primaryColor};">
                                <i class="fas fa-utensils fa-2x" style="color: ${primaryColor}; float: right;"></i>
                                <h4 style="margin: 0; color: ${darkGray};">Total Menu</h4>
                                <p style="font-size: 2.5rem; font-weight: bold; color: ${primaryColor}; margin: 5px 0 0;">${dashboardData.totalItems}</p>
                                <small>(${dashboardData.foodCount} Makanan, ${dashboardData.drinkCount} Minuman)</small>
                            </div>

                            <div class="stat-card" style="background-color: ${whiteColor}; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-bottom: 4px solid ${secondaryColor};">
                                <i class="fas fa-star fa-2x" style="color: ${secondaryColor}; float: right;"></i>
                                <h4 style="margin: 0; color: ${darkGray};">Rating Rata-rata</h4>
                                <p style="font-size: 2.5rem; font-weight: bold; color: ${secondaryColor}; margin: 5px 0 0;">${dashboardData.avgRating}</p>
                                <small>Dari ${dashboardData.totalReviews} ulasan</small>
                            </div>

                            <div class="stat-card" style="background-color: ${whiteColor}; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-bottom: 4px solid #3498db;">
                                <i class="fas fa-bullhorn fa-2x" style="color: #3498db; float: right;"></i>
                                <h4 style="margin: 0; color: ${darkGray};">Menu Spesial Aktif</h4>
                                <p style="font-size: 2.5rem; font-weight: bold; color: #3498db; margin: 5px 0 0;">${dashboardData.specialCount}</p>
                                <small>Jumlah menu yang ditandai spesial</small>
                            </div>
                            
                            <div class="stat-card" style="background-color: ${whiteColor}; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-bottom: 4px solid #2ecc71;">
                                <i class="fas fa-money-bill-wave fa-2x" style="color: #2ecc71; float: right;"></i>
                                <h4 style="margin: 0; color: ${darkGray};">Menu Termahal</h4>
                                <p style="font-size: 1.5rem; font-weight: bold; color: #2ecc71; margin: 5px 0 0;">Rp ${formatPrice(dashboardData.maxPriceItem.price)}</p>
                                <small>${dashboardData.maxPriceItem.name}</small>
                            </div>
                        </div>
                        
                        <div class="chart-area" style="background-color: ${whiteColor}; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h3 style="color: ${primaryColor};">Aksi Cepat Admin</h3>
                            <button onclick="document.querySelector('.nav-link[data-section=\'manage_menu\']').click()" 
                                style="background-color: var(--accent-color); color: var(--white); padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px; font-weight: 600; transition: background-color 0.3s; margin-right: 10px;">
                                <i class="fas fa-plus"></i> Tambah Menu Baru
                            </button>
                             <button onclick="updateUIForSection('ulasan')" 
                                style="background-color: #3498db; color: var(--white); padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px; font-weight: 600; transition: background-color 0.3s;">
                                <i class="fas fa-comments"></i> Lihat Ulasan Terbaru
                            </button>
                        </div>
                        

[Image of a simple dashboard with sales and order charts]

                    `,
                };
            case 'manage_menu': // **HALAMAN TAMBAH MENU BARU**
                if (!isAdmin) {
                    return getContentForSection('login');
                }
                return {
                    title: 'Kelola Menu 📝',
                    contentTitle: 'Tambah Menu Baru',
                    isMenuPage: false,
                    isLogin: false,
                    isManageMenu: true, // Marker baru
                    content: `
                        <form id="addMenuForm" style="max-width: 600px; margin: 20px auto; padding: 30px; background-color: ${whiteColor}; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label for="menuName" style="display: block; margin-bottom: 5px; font-weight: 600;">Nama Menu:</label>
                                <input type="text" id="menuName" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label for="menuCategory" style="display: block; margin-bottom: 5px; font-weight: 600;">Kategori:</label>
                                <select id="menuCategory" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                                    <option value="makanan">Makanan Utama</option>
                                    <option value="minuman">Minuman Segar</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label for="menuPrice" style="display: block; margin-bottom: 5px; font-weight: 600;">Harga (Rp):</label>
                                <input type="number" id="menuPrice" required min="1000" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label for="menuDescription" style="display: block; margin-bottom: 5px; font-weight: 600;">Deskripsi:</label>
                                <textarea id="menuDescription" rows="4" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
                            </div>
                            <div class="form-group" style="margin-bottom: 20px;">
                                <input type="checkbox" id="menuSpecial" style="margin-right: 5px;">
                                <label for="menuSpecial" style="font-weight: 600;">Tandai sebagai Menu Spesial?</label>
                            </div>
                            <button type="submit" 
                                style="background-color: var(--primary-color); color: var(--white); padding: 12px 25px; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; width: 100%; transition: background-color 0.3s;">
                                <i class="fas fa-save"></i> Simpan Menu
                            </button>
                        </form>
                    `,
                };
            case 'login': 
                if (isAdmin) {
                    return getContentForSection('dashboard');
                }
                return {
                    title: 'Login Admin',
                    contentTitle: 'Akses Admin',
                    isMenuPage: false,
                    isLogin: true,
                    content: '', 
                };
            case 'about':
                // Konten About (Tidak berubah)
                return {
                    title: 'Tentang Flores Culinary',
                    contentTitle: 'Kami Adalah Warisan Rasa Flores',
                    isMenuPage: false,
                    isLogin: false,
                    content: `
                        <div class="info-card" style="padding: 30px; background-color: ${lightGray}; border-radius: 12px; margin-bottom: 20px;">
                            <h3 style="color: ${primaryColor};">Visi dan Misi Kami</h3>
                            <p>Flores Culinary didirikan pada tahun 2022 dengan satu tujuan: **melestarikan dan memperkenalkan kekayaan kuliner Flores kepada dunia**. Kami percaya bahwa makanan adalah jembatan budaya. Setiap hidangan kami adalah cerminan dari pulau yang indah ini.</p>
                            <p>Kami bangga menggunakan metode tradisional dan mengedepankan **prinsip keberlanjutan**. Kami bekerjasama langsung dengan kelompok petani lokal di sekitar Ruteng, memastikan kualitas terbaik sambil mendukung ekonomi masyarakat.</p>
                        </div>
                        
                        <div class="info-card" style="display: flex; gap: 30px; background-color: ${whiteColor}; padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="flex: 1;">
                                <h3>Filosofi Makanan</h3>
                                <p>Filosofi kami sederhana: **Rasa Sejati, Bahan Terbaik**. Contohnya, Se'i kami diasap selama berjam-jam menggunakan kayu khusus yang memberikan aroma khas, dan Kopi Arabika kami disajikan dari biji kopi yang ditanam di lereng gunung Flores yang subur.</p>
                            </div>
                             <div style="flex: 1;">
                                <h3>Penghargaan</h3>
                                <p>Pada tahun 2024, kami dianugerahi **"The Best Local Culinary Award"** oleh Asosiasi Pariwisata NTT atas komitmen kami terhadap kualitas dan pelestarian budaya.</p>
                            </div>
                        </div>

                        <div class="info-card" style="margin-top: 20px; background-color: ${whiteColor}; padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h3>Lokasi Kami</h3>
                            <div class="info-row"><i class="fas fa-map-marked-alt"></i><p>Jl. Flores Raya No. 123, Ruteng, NTT</p></div>
                            <p style="margin-top: 10px; font-style: italic;">Kami berlokasi strategis, dekat dengan pusat kota dan mudah diakses dari bandara.</p>
                        </div>
                    `,
                };
            default:
                return getContentForSection('home');
        }
    }

    // Fungsi Utama untuk Mengubah Tampilan
    function updateUIForSection(section) {
        currentSection = section;
        const sectionData = getContentForSection(section);
        
        // Sembunyikan semua tampilan
        contentMenuView.classList.add('hidden');
        contentCartView.classList.add('hidden');
        contentInfoView.classList.add('hidden');
        contentLoginView.classList.add('hidden');
        contentManageMenuView.classList.add('hidden'); // **Sembunyikan View Baru**
        sectionHeader?.classList.add('hidden');
        
        // Kelola visibilitas elemen header (Search & Cart)
        const isPublicView = !isAdmin || (isAdmin && (section === 'menu' || section === 'cart'));
        
        // Mengelola Visibilitas Header (Search & Cart Button)
        searchInput?.classList.toggle('hidden', !isPublicView || section === 'cart' || section === 'home');
        cartBtnHeader?.classList.toggle('hidden', !isPublicView);

        // 1. Update Header Title
        sectionTitle.textContent = sectionData.title;

        // 2. Manage View
        if (section === 'cart') {
            // Tampilan Keranjang
            contentCartView.classList.remove('hidden');

        } else if (sectionData.isLogin) {
            // Tampilan Login Admin
            contentLoginView.classList.remove('hidden');

        } else if (sectionData.isMenuPage) {
            // Tampilan Menu Utama (dengan filter)
            contentMenuView.classList.remove('hidden');
            sectionHeader?.classList.remove('hidden');
            sectionHeader.style.display = 'flex';
            contentMainTitle.textContent = sectionData.contentTitle;
            if(filterControls) filterControls.style.display = 'flex';

            currentFilter = 'all';
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            searchInput.value = '';

            renderMenuItems(false);
            
        } else if (section === 'manage_menu') { // **VIEW BARU: KELOLA MENU**
            contentManageMenuView.classList.remove('hidden');
            contentManageMenuView.innerHTML = sectionData.content;
            
        } else {
            // Tampilan Halaman Info/Dashboard/Home/Review
            contentInfoView.classList.remove('hidden');
            contentInfoView.innerHTML = `<h3 id="contentMainTitle">${sectionData.contentTitle}</h3><div class="info-content-container">${sectionData.content}</div>`;
            
            // Jika Admin dan di Dashboard/Ulasan, sembunyikan Search/Cart
            if (isAdmin && (section === 'dashboard' || section === 'ulasan')) {
                 searchInput?.classList.add('hidden');
                 cartBtnHeader?.classList.add('hidden');
            }
        }

        // 3. Update Active Nav Link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // **INIT FORM LISTENER SETELAH DOM DIMUAT**
        if (section === 'manage_menu') {
            setupAddMenuFormListener();
        }
    }
    
    // --- Menu Rendering ---
    function renderMenuItems(isSearch = false, searchTerm = '') {
        const filteredItems = menuItems.filter(item => {
            const categoryMatch = currentFilter === 'all' || item.category === currentFilter;
            const searchMatch = !isSearch || item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        });

        menuGrid.innerHTML = filteredItems.map(item => `
            <div class="menu-item" data-id="${item.id}" data-category="${item.category}" style="position: relative;">
                <img src="${item.image}" alt="${item.name}">
                ${item.isSpecial ? '<span class="special-tag" style="position: absolute; top: 15px; right: 15px;"><i class="fas fa-star"></i> SPESIAL</span>' : ''}
                <h4>${item.name}</h4>
                <span class="menu-category-tag">${item.category === 'makanan' ? 'Makanan Utama' : 'Minuman Segar'}</span>
                <p class="menu-price">Rp ${formatPrice(item.price)}</p>
                <div class="menu-actions">
                    <button class="add-btn" data-id="${item.id}"><i class="fas fa-cart-plus"></i> Tambah</button>
                    <button class="detail-btn" data-id="${item.id}"><i class="fas fa-info-circle"></i> Detail</button>
                </div>
            </div>
        `).join('');
    }

    // --- Cart Management (Tidak berubah) ---

    function updateCart() {
        if (!cartItems) return; // Guard

        if (cart.length === 0) {
            cartItems.innerHTML = `<p style="text-align: center; color: #999; padding: 20px 0;">Keranjang Anda masih kosong. Mari jelajahi menu kami!</p>`;
            cartTotal.textContent = 'Rp 0';
            cartCountHeader.textContent = '0';
            checkoutBtn.disabled = true;
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">Rp ${formatPrice(item.price)}</p>
                </div>
                <div class="item-controls">
                    <button class="decrease-cart-qty" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="increase-cart-qty" data-id="${item.id}">+</button>
                    <button class="remove-cart-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = `Rp ${formatPrice(total)}`;
        cartCountHeader.textContent = totalItems;
        checkoutBtn.disabled = false;
    }

    function addToCart(itemId, quantity = 1) {
        const item = menuItems.find(i => i.id === itemId);
        if (!item) return;

        const cartItemIndex = cart.findIndex(c => c.id === itemId);

        if (cartItemIndex > -1) {
            cart[cartItemIndex].quantity += quantity;
        } else {
            cart.push({ ...item, quantity });
        }
        updateCart();
        showNotification(`**${item.name}** (${quantity}x) ditambahkan ke keranjang.`);
    }

    function removeCartItem(itemId) {
        const item = cart.find(c => c.id === itemId);
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
        if (item) showNotification(`**${item.name}** dihapus dari keranjang.`);
    }

    function changeCartQuantity(itemId, change) {
        const itemIndex = cart.findIndex(c => c.id === itemId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                removeCartItem(itemId);
            } else {
                updateCart();
            }
        }
    }

    // --- Modal Handling (Tidak berubah) ---

    function showModal(item) {
        selectedMenuItem = item;
        
        document.getElementById('modalImage').src = item.image;
        document.getElementById('modalImage').alt = item.name;
        document.getElementById('modalName').textContent = item.name;
        document.getElementById('modalCategory').textContent = `Kategori: ${item.category === 'makanan' ? 'Makanan Utama' : 'Minuman Segar'}`;
        document.getElementById('modalDescription').textContent = item.description;
        document.getElementById('modalPrice').textContent = `Rp ${formatPrice(item.price)}`;
        document.getElementById('modalQty').value = 1;

        menuModal.classList.add('active');
        body.classList.add('no-scroll');
    }

    function closeModal() {
        menuModal.classList.remove('active');
        body.classList.remove('no-scroll');
        selectedMenuItem = null;
    }
    
    // --- Form Add Menu Listener (BARU) ---
    function setupAddMenuFormListener() {
        const form = document.getElementById('addMenuForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('menuName').value.trim();
                const category = document.getElementById('menuCategory').value;
                const price = document.getElementById('menuPrice').value.trim();
                const description = document.getElementById('menuDescription').value.trim();
                const isSpecial = document.getElementById('menuSpecial').checked;
                
                if (name && price && description) {
                    addNewMenuItem(name, category, price, description, isSpecial);
                    form.reset(); // Reset form setelah sukses
                } else {
                    alert('Semua kolom harus diisi!');
                }
            });
        }
    }


    // --- Event Listeners Setup ---

    function setupEventListeners() {
        // Mobile menu toggle
        mobileMenuToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.dataset.section) {
                    e.preventDefault();
                    updateUIForSection(this.dataset.section);
                    sidebar.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            });
        });

        // Event Listener untuk tombol Keranjang di Header
        cartBtnHeader?.addEventListener('click', function(e) {
            e.preventDefault();
            updateUIForSection('cart');
        });

        // Filter Menu
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function() {
                currentFilter = this.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                searchInput.value = ''; // Reset search saat filter diubah
                renderMenuItems(false);
            });
        });

        // Live Search
        searchInput?.addEventListener('keyup', function() {
            if (currentSection === 'menu') {
                renderMenuItems(true, this.value);
            }
        });

        // Delegasi Event untuk Menu Grid (Add & Detail Button)
        menuGrid?.addEventListener('click', function(e) {
            let targetButton = e.target.closest('.add-btn, .detail-btn');
            if (!targetButton) return;

            const id = parseInt(targetButton.dataset.id);

            if (targetButton.classList.contains('add-btn')) {
                addToCart(id);
            } else if (targetButton.classList.contains('detail-btn')) {
                const item = menuItems.find(i => i.id === id);
                if (item) showModal(item);
            }
        });

        // Delegasi Event untuk Keranjang (Increase, Decrease, Remove)
        if (cartItems) {
            cartItems.addEventListener('click', function(e) {
                let targetButton = e.target.closest('.increase-cart-qty, .decrease-cart-qty, .remove-cart-item');
                if (!targetButton) return;
                
                const id = parseInt(targetButton.dataset.id);

                if (targetButton.classList.contains('increase-cart-qty')) {
                    changeCartQuantity(id, 1);
                } else if (targetButton.classList.contains('decrease-cart-qty')) {
                    changeCartQuantity(id, -1);
                } else if (targetButton.classList.contains('remove-cart-item')) {
                    removeCartItem(id);
                }
            });
        }

        // --- Modal Event Listeners ---
        document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
        document.getElementById('modalDecreaseQty')?.addEventListener('click', function() {
            let qtyInput = document.getElementById('modalQty');
            let currentQty = parseInt(qtyInput.value);
            if (currentQty > 1) qtyInput.value = currentQty - 1;
        });

        document.getElementById('modalIncreaseQty')?.addEventListener('click', function() {
            let qtyInput = document.getElementById('modalQty');
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });

        document.getElementById('addToCartModalBtn')?.addEventListener('click', function() {
            if (selectedMenuItem) {
                const quantity = parseInt(document.getElementById('modalQty').value);
                addToCart(selectedMenuItem.id, quantity);
                closeModal();
            }
        });
        
        // Close modal when clicking outside
        menuModal?.addEventListener('click', function(e) {
            if (e.target === menuModal) {
                closeModal();
            }
        });

        // --- Checkout Simulation ---
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                if (cart.length > 0) {
                    alert(`Pesanan berhasil dikirim ke dapur!\nTotal Bayar: Rp ${formatPrice(total)}\n\nTerima kasih atas pesanan Anda!`);
                    cart = []; // Kosongkan keranjang
                    updateCart();
                    updateUIForSection('home'); // Kembali ke halaman utama
                }
            });
        }

        // --- Dashboard/Login Initial State Check ---
        if (isAdmin && currentSection === 'login') {
            updateUIForSection('dashboard');
        } else if (isAdmin && currentSection !== 'dashboard' && currentSection !== 'manage_menu' && currentSection !== 'ulasan') {
            // Jika sudah login dan tidak di view admin/publik, arahkan ke dashboard.
            updateUIForSection('dashboard');
        }
    }
});