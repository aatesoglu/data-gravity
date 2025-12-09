# Data Gravity - Akıllı Veri Görselleştirme Platformu
Data Gravity, veri setlerinizi saniyeler içinde analiz eden, görselleştiren ve içgörüler sunan modern bir web uygulamasıdır. Yapay zeka destekli analiz motoru ile verilerinizden en iyi şekilde yararlanmanızı sağlar.
## 🚀 Özellikler
- **Akıllı Veri Yükleme**: CSV ve Excel dosyalarını sürükle-bırak yöntemiyle yükleyin.
- **Otomatik Analiz**: Veri setinizdeki sütunları, veri tiplerini ve eksik verileri otomatik analiz eder.
- **Görsel Tavsiye Motoru**: Veri yapınıza en uygun grafik türlerini (Bar, Line, Scatter, Pie vb.) % uygunluk skoru ile önerir.
- **Canlı Önizleme**: Yüklediğiniz grafik görsellerini (ekran görüntüsü vb.) analiz eder ve canlı, animasyonlu grafiklere dönüştürür.
- **Güvenli İşlem**: Tüm veri işleme tarayıcınızda yerel olarak yapılır, sunucuya veri gönderilmez.
## 🛠️ Kurulum ve Çalıştırma
Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:
1.  **Depoyu Klonlayın**:
  ```
    git clone https://https://github.com/aatesoglu/data-gravity.git
    cd data-gravity
    ```
2.  **Bağımlılıkları Yükleyin**:
  ```
    npm install
    ```
3.  **Geliştirme Sunucusunu Başlatın**:
   ```
    npm run dev
    ```
### Backend Kurulumu ve Çalıştırma ###

Backend servisi `backend` klasörü altında yer almaktadır. Yeni bir terminal penceresi açın (veya mevcut pencerede) aşağıdaki komutları sırasıyla uygulayın:

 **Backend klasörüne gidin:**
   ```
    cd backend
    ```
 **Gerekli Python Kütüphanelerini Yükleyin:**
    ```
    pip install "fastapi[standard]"
    ```
4.  **Backend Sunucusunu Başlatın:**
    ```
    
    Uygulamayı geliştirme modunda çalıştırmak için:
    ```
    uvicorn main:app --reload
    ```
    Backend artık `http://127.0.0.1:8000` adresinde çalışıyor olacaktır.
---

### 4. R Entegrasyonu Hakkında Önemli Not
Backend tarafında istatistiksel analizler için **R** dili kullanılmaktadır. `stats.R` dosyasının düzgün çalışabilmesi için:
1.  Bilgisayarınızda **R** yüklü olmalıdır.
2.  R içerisinde `jsonlite` paketi yüklü olmalıdır. R konsolunu açıp şu komutu çalıştırın:
    ```R
    install.packages("jsonlite")
    ```
3.  **Önemli:** `backend/main.py` dosyası içerisinde R çalıştırılabilir dosyasının yolu (`r_executable`) sisteminize göre farklılık gösterebilir. Kod içerisinde varsayılan olarak şu yol tanımlıdır:
    `C:\Program Files\R\R-4.5.2\bin\Rscript.exe`
