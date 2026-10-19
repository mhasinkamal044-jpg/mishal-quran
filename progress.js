// ===== حماية الصفحة =====
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) {
  window.location.href = 'index.html';
}

// ===== تسجيل الخروج =====
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('هل تريد تسجيل الخروج؟')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
});

// ===== مفتاح التخزين الخاص بكل مستخدم =====
const progressKey = 'progress_' + currentUser.email;
let progress = JSON.parse(localStorage.getItem(progressKey) || '[]');

// ===== حفظ في localStorage =====
function saveProgress() {
  localStorage.setItem(progressKey, JSON.stringify(progress));
}

// ===== تحديث الإحصائيات =====
function updateStats() {
  const totalAyahs  = progress.reduce((sum, s) => sum + s.ayahs, 0);
  const totalSurahs = progress.length;
  const streak      = progress.length > 0 ? 7 : 0;
  const percent     = Math.min(100, Math.round((totalAyahs / 200) * 100));

  document.getElementById('totalAyahs').textContent   = totalAyahs;
  document.getElementById('totalSurahs').textContent  = totalSurahs;
  document.getElementById('streak').textContent       = streak;
  document.getElementById('progressPercent').textContent = percent;
  document.getElementById('progressFill').style.width = percent + '%';

  renderTable();
}

// ===== عرض جدول السور =====
function renderTable() {
  const tbody = document.getElementById('surahTable');

  if (progress.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:#999;padding:1.5rem;">
          لا توجد سور مسجلة بعد. أضف أول حفظ لك 👇
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = progress.map((s, index) => `
    <tr>
      <td>${s.surah}</td>
      <td>${s.ayahs}</td>
      <td><span class="badge done">✔ مكتمل</span></td>
      <td>${s.date}</td>
      <td>
        <button class="btn-edit" onclick="editSurah(${index})" title="تعديل">✏️</button>
        <button class="btn-delete" onclick="deleteSurah(${index})" title="حذف">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// ===== إضافة حفظ جديد =====
document.getElementById('addForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const surah = document.getElementById('surahSelect').value;
  const ayahs = parseInt(document.getElementById('ayahCount').value);
const maxAyahs = surahAyahs[surah];
if (maxAyahs && ayahs > maxAyahs) {
  alert(`⚠️ سورة ${surah} تحتوي على ${maxAyahs} آية فقط`);
  return;
}
  if (!surah || isNaN(ayahs) || ayahs < 1) {
    alert('⚠️ الرجاء اختيار السورة وإدخال عدد صحيح من الآيات');
    return;
  }

  const existing = progress.find(s => s.surah === surah);

  if (existing) {
    // إذا كانت السورة موجودة، نضيف الآيات
    existing.ayahs += ayahs;
    existing.date  = new Date().toLocaleDateString('ar-EG');
  } else {
    // سورة جديدة
    progress.push({
      surah,
      ayahs,
      date: new Date().toLocaleDateString('ar-EG')
    });
  }

  saveProgress();
  document.getElementById('addForm').reset();
  updateStats();

  // رسالة تأكيد سريعة
  showToast('✅ تم إضافة الحفظ بنجاح');
});

// ===== حذف سورة =====
function deleteSurah(index) {
  if (confirm('هل تريد حذف هذه السورة من قائمة الحفظ؟')) {
    progress.splice(index, 1);
    saveProgress();
    updateStats();
    showToast('🗑️ تم الحذف');
  }
}

// ===== تعديل سورة =====
function editSurah(index) {
  const current = progress[index];
  const newAyahs = prompt(`تعديل عدد آيات سورة ${current.surah}:`, current.ayahs);

  if (newAyahs === null) return; // المستخدم ألغى

  const parsed = parseInt(newAyahs);
  if (isNaN(parsed) || parsed < 1) {
    alert('⚠️ الرجاء إدخال رقم صحيح');
    return;
  }

  progress[index].ayahs = parsed;
  progress[index].date  = new Date().toLocaleDateString('ar-EG');
  saveProgress();
  updateStats();
  showToast('✏️ تم التعديل');
}

// ===== رسالة منبثقة سريعة =====
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== جعل الدوال متاحة عالمياً =====
window.deleteSurah = deleteSurah;
window.editSurah   = editSurah;

// ===== تشغيل أولي =====
updateStats();
// ===== قاعدة بيانات عدد آيات كل سورة =====
const surahAyahs = {
  "الفاتحة": 7, "البقرة": 286, "آل عمران": 200, "النساء": 176,
  "المائدة": 120, "الأنعام": 165, "الأعراف": 206, "الأنفال": 75,
  "التوبة": 129, "يونس": 109, "هود": 123, "يوسف": 111,
  "الرعد": 43, "إبراهيم": 52, "الحجر": 99, "النحل": 128,
  "الإسراء": 111, "الكهف": 110, "مريم": 98, "طه": 135,
  "الأنبياء": 112, "الحج": 78, "المؤمنون": 118, "النور": 64,
  "الفرقان": 77, "الشعراء": 227, "النمل": 93, "القصص": 88,
  "العنكبوت": 69, "الروم": 60, "لقمان": 34, "السجدة": 30,
  "الأحزاب": 73, "سبأ": 54, "فاطر": 45, "يس": 83,
  "الصافات": 182, "ص": 88, "الزمر": 75, "غافر": 85,
  "فصلت": 54, "الشورى": 53, "الزخرف": 89, "الدخان": 59,
  "الجاثية": 37, "الأحقاف": 35, "محمد": 38, "الفتح": 29,
  "الحجرات": 18, "ق": 45, "الذاريات": 60, "الطور": 49,
  "النجم": 62, "القمر": 55, "الرحمن": 78, "الواقعة": 96,
  "الحديد": 29, "المجادلة": 22, "الحشر": 24, "الممتحنة": 13,
  "الصف": 14, "الجمعة": 11, "المنافقون": 11, "التغابن": 18,
  "الطلاق": 12, "التحريم": 12, "الملك": 30, "القلم": 52,
  "الحاقة": 52, "المعارج": 44, "نوح": 28, "الجن": 28,
  "المزمل": 20, "المدثر": 56, "القيامة": 40, "الإنسان": 31,
  "المرسلات": 50, "النبأ": 40, "النازعات": 46, "عبس": 42,
  "التكوير": 29, "الانفطار": 19, "المطففين": 36, "الانشقاق": 25,
  "البروج": 22, "الطارق": 17, "الأعلى": 19, "الغاشية": 26,
  "الفجر": 30, "البلد": 20, "الشمس": 15, "الليل": 21,
  "الضحى": 11, "الشرح": 8, "التين": 8, "العلق": 19,
  "القدر": 5, "البينة": 8, "الزلزلة": 8, "العاديات": 11,
  "القارعة": 11, "التكاثر": 8, "العصر": 3, "الهمزة": 9,
  "الفيل": 5, "قريش": 4, "الماعون": 7, "الكوثر": 3,
  "الكافرون": 6, "النصر": 3, "المسد": 5, "الإخلاص": 4,
  "الفلق": 5, "الناس": 6
};

// ===== عند اختيار سورة، ضع الحد الأقصى لعدد الآيات =====
document.getElementById('surahSelect').addEventListener('change', function () {
  const ayahInput = document.getElementById('ayahCount');
  const max = surahAyahs[this.value] || '';

  ayahInput.max = max;
  ayahInput.placeholder = max ? `من 1 إلى ${max}` : 'عدد الآيات';
});