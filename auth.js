// ===== التبديل بين التبويبات =====
const tabs  = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
  });
});

// ===== إنشاء حساب =====
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg      = document.getElementById('registerMsg');

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) {
    msg.textContent = '⚠️ هذا البريد مسجل مسبقاً';
    msg.className = 'msg error';
    return;
  }

  users[email] = { name, password };
  localStorage.setItem('users', JSON.stringify(users));

  msg.textContent = '✅ تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول';
  msg.className = 'msg success';

  document.getElementById('registerForm').reset();
  setTimeout(() => document.querySelector('[data-tab="login"]').click(), 1200);
});

// ===== تسجيل الدخول =====
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg      = document.getElementById('loginMsg');

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (!users[email] || users[email].password !== password) {
    msg.textContent = '❌ بيانات الدخول غير صحيحة';
    msg.className = 'msg error';
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify({ email, name: users[email].name }));
  msg.textContent = '✅ جارٍ الدخول...';
  msg.className = 'msg success';

  setTimeout(() => window.location.href = 'home.html', 700);
});

// ===== إن كان المستخدم مسجلاً بالفعل =====
if (localStorage.getItem('currentUser')) {
  window.location.href = 'home.html';
}