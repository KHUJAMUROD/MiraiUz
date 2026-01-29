# Инструкция по настройке EmailJS шаблона

## Шаг 1: Вход в EmailJS Dashboard

1. Перейдите на https://www.emailjs.com/
2. Войдите в свой аккаунт
3. Перейдите в Dashboard

## Шаг 2: Настройка Email Template

1. В Dashboard перейдите в раздел **Email Templates**
2. Найдите шаблон с ID: `template_rsg5f38` или создайте новый
3. Если создаете новый, скопируйте Template ID и обновите его в коде

## Шаг 3: Создание красивого шаблона

Используйте следующий HTML шаблон для вашего email:

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

## Шаг 4: Настройка полей в EmailJS

В настройках шаблона убедитесь, что используются следующие переменные:
- `{{name}}` - Имя клиента
- `{{age}}` - Возраст клиента
- `{{region}}` - Регион клиента
- `{{phone}}` - Телефон клиента (с префиксом +998)
- `{{date}}` - Дата и время отправки

## Шаг 5: Настройка Subject (Тема письма)

Используйте следующий Subject:
```
🎓 Yangi Arizachi: {{name}} - {{region}}
```

Или более простой вариант:
```
Yangi Arizachi - {{name}}
```

## Шаг 6: Проверка настроек

1. Убедитесь, что Service ID правильный: `service_wi37gc6`
2. Убедитесь, что Template ID правильный: `template_rsg5f38`
3. Убедитесь, что Public Key правильный: `jOeGKzCMlJk2YekDb`

## Шаг 7: Тестирование

1. Заполните форму на сайте
2. Отправьте тестовую заявку
3. Проверьте свой email - вы должны получить красиво оформленное письмо с данными клиента

## Дополнительные настройки

### Настройка Email Service

1. Перейдите в **Email Services**
2. Убедитесь, что ваш email сервис подключен и активен
3. Проверьте, что Service ID соответствует: `service_wi37gc6`

### Безопасность

- Public Key безопасно использовать на клиенте (он публичный)
- Не публикуйте Private Key нигде
- EmailJS автоматически ограничивает количество запросов на бесплатном плане

## Поддержка

Если возникли проблемы:
1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что все ключи правильные
3. Проверьте настройки шаблона в EmailJS Dashboard
4. Убедитесь, что Email Service активен
