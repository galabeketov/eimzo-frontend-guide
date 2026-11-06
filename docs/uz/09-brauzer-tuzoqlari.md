# 9. Brauzer tuzoqlari

- **Mixed content.** `https` sahifadan `ws://` ga ulanib bo'lmaydi. Port protokolga qarab tanlanadi (64443 wss / 64646 ws).
- **Self-signed sertifikat.** `wss://127.0.0.1:64443` E-IMZO o'z sertifikati bilan ishlaydi. Ba'zi brauzerlar/OS da birinchi ulanishda ishonch so'raladi. <!-- TODO: Safari, Firefox holatlari -->
- **Safari.** <!-- TODO: localhost WebSocket cheklovlari -->
- **Mobil brauzer.** Desktop E-IMZO yo'q, mobil ilova + QR oqimi kerak. <!-- TODO -->
- **Korporativ proksi / antivirus.** 127.0.0.1 portini bloklashi mumkin.
- **Bir nechta tab.** Har tab o'z socketini ochadi, muammo yo'q, lekin parol oynasi bitta.
- **SPA va global obyektlar.** Rasmiy klient `Date.prototype`/`String.prototype` ni o'zgartiradi — SPA da buni istamasligingiz mumkin.
