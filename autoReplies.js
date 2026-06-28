/**
 * ملف الردود التلقائية
 * كل رد يمكن تفعيله أو تعطيله بـ true/false
 * 
 * Format:
 * {
 *   "الكلمة": { text: "الرد", enabled: true/false }
 * }
 */

const AUTO_REPLIES_CONFIG = {
  // الردود على التحيات
  "السلام عليكم": {
    text: "وعليكم السلام ورحمة الله وبركاته 🌸",
    enabled: true
  },
  "اسلام عليكم": {
    text: "وعليكم السلام ورحمة الله وبركاتة",
    enabled: true
  },
  "هاي": {
    text: "هاي 👋، عامل إيه؟",
    enabled: true
  },
  "اصباح الخير": {
    text: "صباح النور والورد 🌞🌹",
    enabled: true
  },
  "مسااء الخير": {
    text: "مساء الفل والياسمين 🌙✨",
    enabled: true
  },

  // الردود على كلام للبوت
  "ابوت": {
    text: "*عايز اي انجز🐦*",
    enabled: true
  },
  "ي ابوت": {
    text: "*قول يبن المتناكه عايز اي🐦*",
    enabled: true
  },
  "ابحبك": {
    text: "*وأنا كمان بحبك متيجي🐦💋*",
    enabled: true
  },
  "حلب": {
    text: "*حبك برص وعشره خرس🐦*",
    enabled: true
  },
  "بلف": {
    text: "*ايوا بق بف وحب ومنيكه🐦*",
    enabled: true
  },

  // الردود على السب والشتائم
  "بوات عاق": {
    text: "*كسمك ياه متشتمش البوت ي عاااق 🐦*",
    enabled: true
  },
  "بوتا بضان": {
    text: "*مفيش ابضن منك هنا يلا يعاق🐦*",
    enabled: true
  },
  "ةبضان": {
    text: "*خرم طيزك حمضان ناكك محمد رمضان🐦*",
    enabled: true
  },
  "ابان قحبه": {
    text: "*اظـن م ف قحـبه هنا غير امك 🐦*",
    enabled: true
  },
  "قحابه": {
    text: "*امك القحبه طير يعاق 🐦*",
    enabled: true
  },
  "كاسمك": {
    text: "*كسمينك يخول🐦*",
    enabled: true
  },
  "ماتناك": {
    text: "*بنيك امك هناك🐦*",
    enabled: true
  },

  // الردود على الكلام الغريب
  "ياب": {
    text: "*استرجل وقول نعم 🐦*",
    enabled: true
  },
  "نااعم": {
    text: "*حد ناداك 🐦*",
    enabled: true
  },
  "ااحا": {
    text: "`احــــا عــلـــي احــــتـــــك 🌸`",
    enabled: true
  },
  "عامال اي": {
    text: "*انت مالك🐦*",
    enabled: true
  },
  "كاويس الحمدلله": {
    text: "*مش بسال عن حالك بكسف حضرتك🐦*",
    enabled: true
  },
  "اعاملك شاي": {
    text: "*اقـلع*",
    enabled: true
  },
  "لاي": {
    text: "*هعلمك ازاي تعمل شاي🐦*",
    enabled: true
  },
  "الوف": {
    text: "*شكلك شاذ🐦*",
    enabled: true
  },
  "انلت": {
    text: "*تبا لك غبي بحق*🐦",
    enabled: true
  },
  "ا🙂": {
    text: "*بـص بـعـيد🙂*",
    enabled: true
  },
  "ا": {
    text: "*حبك برص وعشره خرس🐦*",
    enabled: true
  }
};

/**
 * دالة للحصول على الرد التلقائي
 * @param {string} text - النص المرسل
 * @returns {string|null} - الرد أو null
 */
function getAutoReply(text) {
  const normalized = text.trim().toLowerCase();
  const reply = AUTO_REPLIES_CONFIG[normalized];

  if (reply && reply.enabled) {
    return reply.text;
  }

  return null;
}

/**
 * دالة لتفعيل/تعطيل رد تلقائي
 * @param {string} keyword - الكلمة المفتاحية
 * @param {boolean} enabled - تفعيل أم لا
 */
function toggleAutoReply(keyword, enabled) {
  const normalized = keyword.toLowerCase();
  if (AUTO_REPLIES_CONFIG[normalized]) {
    AUTO_REPLIES_CONFIG[normalized].enabled = enabled;
    return true;
  }
  return false;
}

/**
 * دالة للحصول على جميع الردود النشطة
 * @returns {object} - الردود المفعلة فقط
 */
function getEnabledReplies() {
  const enabled = {};
  Object.entries(AUTO_REPLIES_CONFIG).forEach(([key, value]) => {
    if (value.enabled) {
      enabled[key] = value.text;
    }
  });
  return enabled;
}

module.exports = {
  AUTO_REPLIES_CONFIG,
  getAutoReply,
  toggleAutoReply,
  getEnabledReplies
};
