<?php
session_start();

// Data login admin (ganti dengan database asli jika di produksi)
$ADMIN_USERNAME = 'oliviaa';
$ADMIN_PASSWORD = '2106';

$login_error = '';

// --- LOGIC: LOGIN ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === $ADMIN_USERNAME && $password === $ADMIN_PASSWORD) {
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $ADMIN_USERNAME;
        
        // Redirect untuk mencegah resubmission form
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    } else {
        $login_error = 'Username atau kata sandi salah!';
    }
}

// --- LOGIC: LOGOUT ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit();
}

// --- INISIALISASI VARIABEL PENTING (DIJAMIN SELALU ADA) ---
// Perbaikan: Menggunakan $_SESSION yang benar
$is_admin = $_SESSION['logged_in'] ?? false;
$initial_section = $is_admin ? 'dashboard' : 'home';
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flores Culinary - Taste the Authentic Flavors</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
</head>
<body 
    data-is-admin="<?php echo $is_admin ? 'true' : 'false'; ?>" 
    data-initial-section="<?php echo $initial_section; ?>"
>
    <button class="mobile-menu-toggle" id="mobileMenuToggle">
        <i class="fas fa-bars"></i>
    </button>

    <nav class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h1><i class="fas fa-leaf"></i> Flores Culinary</h1>
        </div>
        <div class="sidebar-nav">
            <ul>
                                <li><a href="#" class="nav-link active" data-section="home"><i class="fas fa-home"></i> Beranda</a></li>
                <li><a href="#" class="nav-link" data-section="menu"><i class="fas fa-utensils"></i> Semua Menu</a></li>
                <li><a href="#" class="nav-link" data-section="ulasan"><i class="fas fa-comments"></i> Ulasan</a></li>
                <li><a href="#" class="nav-link" data-section="about"><i class="fas fa-info-circle"></i> Tentang Kami</a></li>
                
                <hr style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 10px 0;">

                                <li class="nav-item <?php echo $is_admin ? '' : 'hidden'; ?>" id="navAdminDashboard">
                    <a href="#" class="nav-link" data-section="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard Admin</a>
                </li>
                <li class="nav-item <?php echo $is_admin ? '' : 'hidden'; ?>" id="navAdminManageMenu">
                    <a href="#" class="nav-link" data-section="manage_menu"><i class="fas fa-plus-circle"></i> Kelola Menu</a>
                </li>
                                
                                <li class="nav-item <?php echo $is_admin ? 'hidden' : ''; ?>" id="navLogin">
                    <a href="#" class="nav-link" data-section="login"><i class="fas fa-user-shield"></i> Login Admin</a>
                </li>
                <li class="nav-item <?php echo $is_admin ? '' : 'hidden'; ?>" id="navAdminLogout">
                                        <form method="POST" style="padding: 10px 15px; margin-top: 5px;">
                        <button type="submit" name="logout" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout (<?php echo $_SESSION['username'] ?? 'Admin'; ?>)</button>
                    </form>
                </li>

            </ul>
        </div>
    </nav>

    <main class="main-content">
        <header>
            <div class="header-title">
                <h2 id="sectionTitle">
                    <?php echo $is_admin ? 'Dashboard Admin 📊' : 'Beranda'; ?>
                </h2>
            </div>
            <div class="header-actions">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Cari menu..." id="searchInput">
                </div>
                <button class="cart-btn" id="cartBtnHeader" data-section="cart">
                    <i class="fas fa-shopping-basket"></i>
                    Keranjang (<span id="cartCountHeader">0</span>)
                </button>
            </div>
        </header>

        <div class="content-wrapper">
                        <div class="content-login-view hidden" id="contentLoginView">
                <div class="login-card">
                    <h3><i class="fas fa-user-lock"></i> Login Admin</h3>
                    <?php if ($login_error): ?>
                        <p class="error-message" style="color: red; text-align: center; margin-bottom: 15px;"><?php echo $login_error; ?></p>
                    <?php endif; ?>
                    <form method="POST">
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Kata Sandi:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" name="login" class="login-btn"><i class="fas fa-sign-in-alt"></i> Login</button>
                    </form>
                </div>
            </div>

                        <div class="content-menu-view" id="contentMenuView">
                <div class="section-header">
                    <h3 id="contentMainTitle"></h3>
                    <div class="filter-controls">
                        <button class="filter-btn active" data-filter="all">Semua</button>
                        <button class="filter-btn" data-filter="makanan">Makanan</button>
                        <button class="filter-btn" data-filter="minuman">Minuman</button>
                    </div>
                </div>

                <div class="menu-grid" id="menuGrid">
                </div>
            </div>

                        <div class="content-cart-view hidden" id="contentCartView">
                <div class="cart-summary">
                    <h3><i class="fas fa-shopping-basket"></i> Ringkasan Pesanan Anda</h3>
                    <div class="cart-items" id="cartItems">
                        <p style="text-align: center; color: #999;">Keranjang Anda masih kosong.</p>
                    </div>
                    <div class="cart-summary-footer">
                        <div class="cart-total">
                            <h4>Total Pembayaran:</h4>
                            <p id="cartTotal">Rp 0</p>
                        </div>
                        <button class="checkout-btn" id="checkoutBtn" disabled><i class="fas fa-wallet"></i> Bayar Sekarang</button>
                    </div>
                </div>

                <div class="delivery-info">
                    <h3><i class="fas fa-truck"></i> Informasi Pengiriman</h3>
                    <div class="info-row">
                        <i class="fas fa-user-circle"></i>
                        <p id="recipientName">Sofia Naomi</p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-phone-alt"></i>
                        <p id="recipientPhone">0812-3456-789</p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-map-marked-alt"></i>
                        <p id="recipientAddress">Jl. Flores Raya No. 123, Ruteng</p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-shipping-fast"></i>
                        <p>Estimasi Waktu: **30-45 menit**</p>
                    </div>
                </div>
            </div>
            
                        <div id="contentInfoView" class="content-info-view">
                            </div>

                        <div id="contentManageMenuView" class="content-view hidden">
                            </div>

        </div>
    </main>

    <div id="menuModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Detail Menu</h3>
                <span class="close-btn" id="closeModalBtn">&times;</span>
            </div>
            <div class="modal-body">
                <div class="modal-image" id="modalImageContainer">
                    <img id="modalImage" src="https://via.placeholder.com/400x200" alt="Menu Item" />
                </div>
                <div class="modal-details">
                    <h4 id="modalName">Nama Menu</h4>
                    <span id="modalCategory" class="menu-category-tag">Kategori: Makanan</span>
                    <p><strong>Deskripsi:</strong></p>
                    <p id="modalDescription" class="detail-description">Deskripsi lengkap item menu.</p>
                    <div class="modal-price-actions">
                        <p class="modal-price" id="modalPrice">Rp 0</p>
                        <div class="modal-actions">
                            <div class="quantity-input">
                                <button id="modalDecreaseQty">-</button>
                                <input type="number" id="modalQty" value="1" min="1" readonly>
                                <button id="modalIncreaseQty">+</button>
                            </div>
                            <button id="addToCartModalBtn" class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="notification">
        <span id="notificationText"></span>
    </div>

        <script src="script.js"></script>
</body>
</html>