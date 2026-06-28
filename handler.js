const { loadPlugins } = require('./plugins');
const config = require('../config');
const logger = require('../utils/console');
const fs = require('fs-extra');
const path = require('path');
const { isElite } = require('../haykala/elite');
const { playSound } = require('../main');
const handleButtons = require('./buttons'); 

const commands = new Map();

function cmd(options = {}) {
    if (!options.name || !options.exec) {
        throw new Error('يجب تحديد اسم الأمر ودالة التنفيذ');
    }

    commands.set(options.name.toLowerCase(), {
        name: options.name,
        exec: options.exec,
        description: options.description || '',
        usage: options.usage || '',
        category: options.category || 'عام',
        cooldown: options.cooldown || 0,
        owner: options.owner || false,
        group: options.group || false,
    });

    logger.info(`تم تسجيل الأمر: ${options.name}`);
}

async function handleMessages(sock, { messages }) {
    let message;
    try {
        message = messages[0];
        if (!message) return;

        const body = message.message?.conversation ||
                     message.message?.extendedTextMessage?.text ||
                     message.message?.imageMessage?.caption ||
                     message.message?.videoMessage?.caption || '';

        if (!body) return;

        // -----------------------------
        // ← هنا أضفت الردود التلقائية وتفاعل "مارو"
        // -----------------------------
        try {
            const normalized = body.trim().toLowerCase();

            // الردود التلقائية (مطابقة كاملة للنص)
            const autoReplies = {
                "السلام عليكم": "وعليكم السلام ورحمة الله وبركاته 🌸",
                "هاي": "هاي 👋، عامل إيه؟",
                "ابوت": "*عايز اي انجز🐦*",
                "ابحبك": "*وأنا كمان بحبك متيجي🐦💋*",
                "اصباح الخير": "صباح النور والورد 🌞🌹",
                "مسااء الخير": "مساء الفل والياسمين 🌙✨",
                "بوات عاق": "*كسمك ياه متشتمش البوت ي عاااق 🐦*",
                "ياب": "*استرجل وقول نعم 🐦*",
                "نااعم": "*حد ناداك 🐦*",
                "ااحا": "`احــــا عــلـــي احــــتـــــك 🌸`",
                "ابان قحبه": "*اظـن م ف قحـبه هنا غير امك 🐦*",
                "قحابه": "*امك القحبه طير يعاق 🐦*",
                "عامال اي": "*انت مالك🐦*",
                "كاويس الحمدلله": "*مش بسال عن حالك بكسف حضرتك🐦*",
                "بوتا بضان": "*مفيش ابضن منك هنا يلا يعاق🐦*",
                "ةبضان": "*خرم طيزك حمضان ناكك محمد رمضان🐦*",
                "اعاملك شاي": "*اقـلع*",
                "لاي": "*هعلمك ازاي تعمل شاي🐦*",
                "ماتناك": "*بنيك امك هناك🐦*",
                "الوف": "*شكلك شاذ🐦*", 
                "انلت": "*تبا لك غبي بحق*🐦", 
                "ا🙂": "*بـص بـعـيد🙂*", 
                "اسلام عليكم": "*وعليكم السلام ورحمة الله وبركاتة*", 
                "حلب": "*حبك برص وعشره خرس🐦*", 
                "ا": "*حبك برص وعشره خرس🐦*", 
                "بلف": "*ايوا بق بف وحب ومنيكه🐦*", 
                "كاسمك": "*كسمينك يخول🐦*", 
                "ي ابوت": "*قول يبن المتناكه عايز اي🐦*" 
                
                  };
           
            if (autoReplies[normalized]) {
                // إرسال الرد التلقائي كـ اقتباس (quoted)
                const replyText = autoReplies[normalized] + ".";
                await sock.sendMessage(message.key.remoteJid, { text: replyText }, { quoted: message }).catch(()=>{});
                return; // إنتهى المعالجة لو كانت رسالة مطابقة لرد تلقائي
            }

            // تفاعل "مارو" — كلمات مفتاحية داخل النص
            if (normalized.includes("مارو") || normalized.includes("عمر") || normalized.includes("ادريان")) {
                try {
                    // إرسال ريأكت عشوائي
                    const waveEmojis = ["⚡", "🔥", "💥", "🩶", "👄", "💋", "♥", "🐦", "🗿", "💙", "🙂"];
                    const randomEmoji = waveEmojis[Math.floor(Math.random() * waveEmojis.length)];
                    await sock.sendMessage(message.key.remoteJid, {
                        react: { text: randomEmoji, key: message.key }
                    }).catch(()=>{});

                    // إعداد الثمبنال المحلي (صورة: ../مارو/صورة.jpg)
                    const thumbPath = path.join(__dirname, '..', 'مارو','صورة.jpg');
                    let thumbBuffer = null;
                    if (fs.existsSync(thumbPath)) {
                        thumbBuffer = fs.readFileSync(thumbPath);
                    } else {
                        // لو الصورة مش موجودة نستخدم بافر فارغ (لن يتعطل)
                        thumbBuffer = Buffer.alloc(10);
                        logger.warn("⚠️ ملف الصورة ../مارو/صورة.jpg غير موجود، تم استخدام بافر افتراضي.");
                    }

                    // ملف الصوت
                    const audioPath = path.join(__dirname, '..', 'مارو', 'ahh.mp3');
                    const groupLink = "https://chat.whatsapp.com/HapOsDZk6rS8GL5Qo7cdTq";

                    if (fs.existsSync(audioPath)) {
                        await sock.sendMessage(
                            message.key.remoteJid,
                            {
                                audio: { url: audioPath },
                                mimetype: "audio/mpeg",
                                ptt: false, // لـو علق خـلـيـه false.. 
                                contextInfo: {
                                    externalAdReply: {
                                        title: "𝒀𝑨𝑴𝑨𝑻𝑶 𓂀",
                                        body: "𝑭𝑼𝑪𝑲 𝒀𝑶𝑼",
                                        mediaType: 1,
                                        thumbnail: thumbBuffer,
                                        showAdAttribution: true,
                                        sourceUrl: groupLink
                                    }
                                }
                            },
                            { quoted: message }
                        ).catch(()=>{});
                    } else {
                        logger.warn("⚠️ ملف الصوت ../مارو/𝐌𝐀𝐑𝐎.mp3 غير موجود.");
                    }
                } catch (err) {
                    logger.error('✗ خطأ أثناء تفاعل مارو:', err);
                }
                return; // إنتهت المعالجة لتفاعل مارو
            }
        } catch (errAuto) {
            // لا نوقف المعالج لو فشل البلوك بتاع الردود التلقائية
            logger.warn('⚠ خطأ في بلوك الردود التلقائية (غير حاسم):', errAuto.message || errAuto);
        }
        // -----------------------------
        // ← انتهت الإضافات هنا، تكملة الكود الأصلي
        // -----------------------------

        const currentPrefix = config.prefix;
        if (!body.toLowerCase().startsWith(currentPrefix.toLowerCase())) return;

        const parts = body.slice(currentPrefix.length).trim().split(/\s+/);
        const command = parts[0]?.toLowerCase();
        const args = parts.slice(1);
        if (!command) return;

        logger.info(`تم استلام أمر: ${command} من: ${message.key.remoteJid}`);

        const botPath = path.join(__dirname, '../data/bot.txt');
        let botStatus = '[on]';
        if (fs.existsSync(botPath)) {
            botStatus = fs.readFileSync(botPath, 'utf8').trim();
        }
        if (botStatus === '[off]' && command !== 'bot') {
            logger.warn(`⚠ البوت موقوف. تجاهل الأمر: ${command}`);
            return;
        }

        let senderNumber;
        if (message.key.remoteJid.endsWith('@g.us')) {
            senderNumber = message.key.participant?.split('@')[0] || '';
        } else {
            senderNumber = message.key.remoteJid.split('@')[0];
        }

        const modePath = path.join(__dirname, '../data/mode.txt');
        let eliteMode = false;
        if (fs.existsSync(modePath)) {
            eliteMode = fs.readFileSync(modePath, 'utf8').trim() === '[on]';
        }
        if (eliteMode && !isElite(senderNumber)) {
            logger.warn(`⚠ تجاهل من غير النخبة: ${senderNumber}`);
            return;
        }

        const plugins = await loadPlugins();
        const handler = plugins[command];
        if (!handler) {
            logger.warn(`⚠ أمر غير معروف: ${command}`);
            return;
        }

        message.args = args;
        message.command = command;
        message.prefix = currentPrefix;

        if (handler.elite && !config.owners.includes(senderNumber)) {
            await sock.sendMessage(message.key.remoteJid, { text: config.messages.ownerOnly });
            return;
        }
        if (handler.group && !message.key.remoteJid.endsWith('@g.us')) {
            await sock.sendMessage(message.key.remoteJid, { text: config.messages.groupOnly });
            return;
        }

        if (typeof handler === 'function') {
            await handler(sock, message);
        } else if (typeof handler.execute === 'function') {
            await handler.execute(sock, message, args);
        } else {
            throw new Error('❌ المعالج غير صالح: لا توجد دالة execute');
        }

        logger.success(`✓ تم تنفيذ الأمر: ${command}`);
    } catch (error) {
        logger.error(`✗ خطأ في معالجة الرسالة: ${error.stack}`);
        playSound('ERROR');
        if (message?.key?.remoteJid) {
            await sock.sendMessage(message.key.remoteJid, {
                text: config.messages.error
            }).catch(() => {});
        }
    }
}

// مولد الإضافات
function createPluginHandler(options = {}) {
    const pluginHandler = options.execute || (() => {});
    pluginHandler.elite = options.elite || false;
    pluginHandler.group = options.group || false;
    pluginHandler.desc = options.desc || 'لا يوجد وصف';
    pluginHandler.command = options.command || 'لا يوجد أمر محدد';
    pluginHandler.usage = options.usage || 'لا توجد معلومات استخدام';
    return pluginHandler;
}

// تهيئة النظام
function handleMessagesLoader() {
    logger.info("✓ تم تهيئة نظام الرسائل بنجاح.");
}

// التصدير
module.exports = {
    handleMessages,
    cmd,
    commands,
    createPluginHandler,
    handleMessagesLoader
};