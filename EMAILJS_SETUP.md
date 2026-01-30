# Инструкция по настройке EmailJS шаблонов

## Обзор

Настроены два шаблона:
1. **Шаблон для владельца** (`template_rsg5f38`) - письмо с данными клиента приходит вам
2. **Шаблон для пользователя** (`template_user_reply`) - автоматический ответ клиенту на его email

---

## Шаг 1: Вход в EmailJS Dashboard

1. Перейдите на https://www.emailjs.com/
2. Войдите в свой аккаунт
3. Перейдите в Dashboard

---

## Шаг 2: Настройка Email Template для владельца

### 2.1 Создание/редактирование шаблона

1. В Dashboard перейдите в раздел **Email Templates**
2. Найдите шаблон с ID: `template_rsg5f38` или создайте новый
3. Если создаете новый, скопируйте Template ID и обновите его в коде (файл `page.jsx`, строка с `template_rsg5f38`)

### 2.2 Настройка шаблона для владельца

**Subject (Тема письма):**
```
🎓 Yangi Arizachi: {{name}} - {{region}}
```

**To Email (Кому):**
```
ваш-email@example.com
```

**HTML шаблон:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f8f8;
      border-radius: 8px;
      border-left: 4px solid #dc2626;
    }
    .field-label {
      font-weight: 700;
      color: #dc2626;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
    }
    .field-value {
      font-size: 16px;
      color: #171717;
      margin-top: 5px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      background-color: #dc2626;
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Yangi Arizachi</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">MIRAI - Yaponiyada Ta'lim</p>
    </div>
    
    <div class="content">
      <div class="badge">Yangi Arizachi</div>
      
      <div class="field">
        <div class="field-label">👤 Ism</div>
        <div class="field-value">{{name}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">🎂 Yosh</div>
        <div class="field-value">{{age}} yosh</div>
      </div>
      
      <div class="field">
        <div class="field-label">📍 Viloyat</div>
        <div class="field-value">{{region}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">📞 Telefon</div>
        <div class="field-value">{{phone}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">📧 Email</div>
        <div class="field-value">{{email}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">💬 Izoh</div>
        <div class="field-value">{{comment}}</div>
      </div>
      
      <div class="field">
        <div class="field-label">📅 Vaqt</div>
        <div class="field-value">{{date}}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Bu xabar MIRAI veb-saytidan avtomatik yuborilgan</p>
      <p style="margin-top: 10px; font-size: 12px; color: #999;">
        © 2024 MIRAI - Yaponiyada Ta'lim
      </p>
    </div>
  </div>
</body>
</html>
```

### 2.3 Переменные шаблона для владельца

Убедитесь, что в настройках шаблона используются следующие переменные:
- `{{name}}` - Имя клиента
- `{{age}}` - Возраст клиента
- `{{region}}` - Регион клиента
- `{{phone}}` - Телефон клиента (с префиксом +998)
- `{{email}}` - Email клиента
- `{{comment}}` - Комментарий клиента
- `{{date}}` - Дата и время отправки

---

## Шаг 3: Настройка Email Template для пользователя (автоматический ответ)

### 3.1 Создание нового шаблона

1. В Dashboard перейдите в раздел **Email Templates**
2. Нажмите **Create New Template**
3. Назовите шаблон: `User Reply Template` или `Автоматический ответ клиенту`
4. Скопируйте Template ID (будет выглядеть как `template_xxxxxxx`)
5. Обновите Template ID в коде (файл `page.jsx`, строка с `template_user_reply`)

### 3.2 Настройка шаблона для пользователя

**Subject (Тема письма):**
```
Rahmat! Sizning arizangiz qabul qilindi - MIRAI
```

**To Email (Кому):**
```
{{user_email}}
```

**Reply To (Ответить на):**
```
ваш-email@example.com
```

**HTML шаблон для пользователя:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      margin-bottom: 30px;
    }
    .greeting {
      font-size: 18px;
      color: #171717;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .message {
      font-size: 16px;
      color: #333;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #dc2626;
      margin: 20px 0;
    }
    .highlight-text {
      font-size: 15px;
      color: #171717;
      font-weight: 600;
    }
    .contact-info {
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .contact-info h3 {
      color: #dc2626;
      font-size: 18px;
      margin: 0 0 15px 0;
    }
    .contact-info p {
      margin: 8px 0;
      font-size: 15px;
      color: #171717;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background-color: #dc2626;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Rahmat, {{user_name}}!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">MIRAI - Yaponiyada Ta'lim</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Xurmatli {{user_name}}!
      </div>
      
      <div class="message">
        Sizning arizangiz muvaffaqiyatli qabul qilindi! Biz sizning qiziqishingizni qadrlaymiz va tez orada mutaxassislarimiz siz bilan bog'lanib, barcha savollaringizga javob beradi.
      </div>
      
      <div class="highlight">
        <div class="highlight-text">
          ⏰ Keyingi qadamlar:
        </div>
        <ul style="margin: 10px 0 0 20px; padding: 0;">
          <li style="margin: 8px 0;">Bizning mutaxassislarimiz siz bilan 24 soat ichida bog'lanadi</li>
          <li style="margin: 8px 0;">Bepul konsultatsiya va barcha savollaringizga javob olasiz</li>
          <li style="margin: 8px 0;">Viza jarayoni va ta'lim haqida batafsil ma'lumot beramiz</li>
        </ul>
      </div>
      
      <div class="message">
        Agar sizda shoshilinch savollar bo'lsa, bizga to'g'ridan-to'g'ri telefon orqali murojaat qilishingiz mumkin.
      </div>
      
      <div class="contact-info">
        <h3>📞 Biz bilan bog'lanish</h3>
        <p><strong>Telefon:</strong> +998 XX XXX XX XX</p>
        <p><strong>Email:</strong> info@mirai.uz</p>
        <p><strong>Veb-sayt:</strong> www.mirai.uz</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://www.mirai.uz" class="button">Veb-saytga qaytish</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Hurmat bilan,<br><strong>MIRAI Jamoa</strong></p>
      <p style="margin-top: 10px; font-size: 12px; color: #999;">
        © 2024 MIRAI - Yaponiyada Ta'lim<br>
        Bu xabar avtomatik yuborilgan. Iltimos, bu xabarga javob bermang.
      </p>
    </div>
  </div>
</body>
</html>
```

### 3.3 Переменные шаблона для пользователя

Убедитесь, что в настройках шаблона используются следующие переменные:
- `{{user_name}}` - Имя пользователя (используется в HTML шаблоне)
- `{{email}}` - Email пользователя (используется в поле "To Email")

**КРИТИЧЕСКИ ВАЖНО:** 

1. В поле **"To Email"** шаблона для пользователя должно быть указано `{{email}}` (без кавычек!)
2. В HTML шаблоне используйте переменную `{{user_name}}` для имени пользователя
3. Убедитесь, что шаблон `template_mft8fy2` активен и правильно настроен

### Проверка настроек шаблона:

1. Откройте шаблон `template_mft8fy2` в EmailJS Dashboard
2. Проверьте поле **"To Email"** - должно быть: `{{email}}` ✅
3. Проверьте поле **"From Name"** (опционально): `MIRAI - Yaponiyada Ta'lim`
4. Проверьте поле **"Reply To"** (опционально): ваш email для ответов (например: `xujanov.xujamurod@gmail.com`)
5. Убедитесь, что в HTML шаблоне используется переменная:
   - `{{user_name}}` - для имени пользователя
   - `{{email}}` - используется только в поле "To Email", не в HTML

**Важно:** Код отправляет переменные `user_name` и `email`, поэтому в шаблоне:
- Поле "To Email": `{{email}}`
- HTML шаблон: `{{user_name}}` для имени

---

## Шаг 4: Настройка Email Service

1. Перейдите в **Email Services**
2. Убедитесь, что ваш email сервис подключен и активен
3. Проверьте, что Service ID соответствует: `service_wi37gc6`
4. Если используете Gmail, убедитесь, что включена двухфакторная аутентификация и создан App Password

---

## Шаг 5: Обновление кода

✅ **Код уже обновлен!** Template ID для автоматического ответа пользователю: `template_mft8fy2`

Код в `src/app/page.jsx` уже использует правильный Template ID:
```javascript
const userResult = await emailjs.send(
  'service_wi37gc6',
  'template_mft8fy2',  // Template ID для автоматического ответа
  {
    user_name: formData.name,
    user_email: formData.email,
  },
  'jOeGKzCMlJk2YekDb'
);
```

---

## Шаг 6: Проверка настроек

Убедитесь, что все ID правильные:

1. **Service ID:** `service_wi37gc6`
2. **Template ID для владельца:** `template_rsg5f38`
3. **Template ID для пользователя:** `template_mft8fy2` ✅
4. **Public Key:** `jOeGKzCMlJk2YekDb`

---

## Шаг 7: Тестирование

1. Заполните форму на сайте (включая email и комментарий)
2. Отправьте тестовую заявку
3. Проверьте свой email - вы должны получить письмо с данными клиента
4. Проверьте email клиента - он должен получить автоматический ответ

---

## Как это работает

1. **Пользователь заполняет форму** на сайте (имя, возраст, регион, телефон, email, комментарий)
2. **Отправляется письмо владельцу** - вы получаете все данные клиента
3. **Отправляется автоматический ответ** - клиент получает благодарственное письмо на свой email

---

## Дополнительные настройки

### Настройка контактной информации в шаблоне для пользователя

В шаблоне для пользователя обновите контактную информацию:
- Замените `+998 XX XXX XX XX` на ваш реальный телефон
- Замените `info@mirai.uz` на ваш реальный email
- Замените `www.mirai.uz` на ваш реальный сайт

### Безопасность

- Public Key безопасно использовать на клиенте (он публичный)
- Не публикуйте Private Key нигде
- EmailJS автоматически ограничивает количество запросов на бесплатном плане
- На бесплатном плане: 200 писем/месяц

### Лимиты EmailJS

- **Free план:** 200 писем/месяц
- **Paid планы:** от 1000+ писем/месяц

---

## Поддержка

Если возникли проблемы:

1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что все ключи правильные
3. Проверьте настройки обоих шаблонов в EmailJS Dashboard
4. Убедитесь, что Email Service активен
5. Проверьте, что в шаблоне для пользователя поле "To Email" содержит `{{user_email}}`
6. Убедитесь, что email клиента валидный

---

## Часто задаваемые вопросы

**Q: Почему клиент не получает автоматический ответ?**
A: Проверьте, что:
- Template ID для пользователя правильный (`template_mft8fy2`)
- В шаблоне поле "To Email" содержит `{{user_email}}` (БЕЗ кавычек!)
- Email клиента валидный
- Не превышен лимит писем в EmailJS
- Шаблон активен в EmailJS Dashboard

**Q: Ошибка "Failed to send user reply email: {}"**
A: Это означает, что шаблон `template_mft8fy2` настроен неправильно. Проверьте:

1. **Откройте шаблон `template_mft8fy2` в EmailJS Dashboard**
2. **Проверьте поле "To Email":**
   - Должно быть: `{{user_email}}` (без кавычек, без пробелов)
   - НЕ должно быть: `"{{user_email}}"` или `{{ user_email }}` или ваш email
   
3. **Проверьте переменные в шаблоне:**
   - В HTML используйте: `{{user_name}}` и `{{user_email}}`
   - Переменные должны совпадать с теми, что отправляются из кода
   
4. **Проверьте, что шаблон активен:**
   - В списке шаблонов должен быть зеленый индикатор "Active"
   
5. **Проверьте консоль браузера:**
   - Откройте Developer Tools (F12)
   - Перейдите на вкладку Console
   - Отправьте форму и посмотрите детали ошибки
   - Должны быть видны: `status`, `text`, `message`

**Q: Можно ли изменить текст автоматического ответа?**
A: Да, просто отредактируйте HTML шаблон для пользователя в EmailJS Dashboard

**Q: Как добавить больше полей в форму?**
A: Добавьте поле в `formData`, в форму и в шаблон для владельца
