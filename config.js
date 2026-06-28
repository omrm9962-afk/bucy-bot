/**
 * ملف الإعدادات الرئيسية
 */

module.exports = {
  // رقم المالك
  OWNER_NUMBER: process.env.OWNER_NUMBER || '201000000000',
  
  // البادئة
  PREFIX: '.',
  
  // البوت
  BOT_NAME: 'BUCY AI X',
  BOT_VERSION: '1.0.0',
  
  // الألوان والرموز
  EMOJI: {
    SUCCESS: '✅',
    ERROR: '❌',
    INFO: 'ℹ️',
    WARN: '⚠️',
    DEBUG: '🐛',
    ROCKET: '🚀',
    HEART: '❤️'
  },

  // رسائل البوت
  MESSAGES: {
    ownerOnly: '❌ هذا الأمر للمالك فقط!',
    groupOnly: '❌ هذا الأمر للجروبات فقط!',
    privateOnly: '❌ هذا الأمر للخاص فقط!',
    error: '❌ حدث خطأ ما!',
    commandNotFound: '❌ الأمر غير موجود!',
    processing: '⏳ جاري المعالجة...'
  }
};
