# 9. Brauzer tuzoqlari

- **Mixed content.** `https` sahifadan `ws://` ga ulanib bo'lmaydi. Port protokolga qarab tanlanadi (64443 wss / 64646 ws).
- **Self-signed sertifikat.** `wss://127.0.0.1:64443` E-IMZO o'z sertifikati bilan ishlaydi. Ba'zi brauzerlar/OS da birinchi ulanishda ishonch so'raladi. <!-- TODO: Safari, Firefox holatlari -->
- **Safari.** <!-- TODO: localhost WebSocket cheklovlari -->
- **Mobil brauzer.** Desktop E-IMZO yo'q, mobil ilova + QR oqimi kerak. <!-- TODO -->
- **Korporativ proksi / antivirus.** 127.0.0.1 portini bloklashi mumkin.
- **Bir nechta tab.** Har tab o'z socketini ochadi, muammo yo'q, lekin parol oynasi bitta.
- **SPA va global obyektlar.** Rasmiy klient `Date.prototype`/`String.prototype` ni o'zgartiradi — SPA da buni istamasligingiz mumkin.
- **Windows'da E-IMZO ishga tushmaydi.** Dinamik TCP port oralig'i tor; `netsh` bilan kengaytiriladi, 02-bo'limga qarang. *(e-imzo-doc §4.2)*
- **Sahifa yangilansa `keyId` yo'qoladi.** Parol yana so'raladi — SPA ichida sahifani reload qilmasdan navigatsiya qiling. *(e-imzo-doc §1.3)*
- **Parol oynasi orqada qoladi (macOS).** E-IMZO oynasi Java oynasi, brauzer ustiga chiqmaydi va taxminan 60 soniyadan keyin o'zi yopilib `Ввод пароля отменен` qaytaradi. Foydalanuvchi "oyna chiqmadi" deb o'ylaydi. Imzolash tugmasi yonida "E-IMZO oynasini Dock'dan oching" degan eslatma qo'ying. *(tekshirildi: E-IMZO 5.0, macOS, 2026-11-06)*
