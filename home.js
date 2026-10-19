// ===== حماية الصفحة =====
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) {
  window.location.href = 'index.html';
} else {
  document.getElementById('userName').textContent = currentUser.name;
}

// ===== تسجيل الخروج =====
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('هل تريد تسجيل الخروج؟')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
});