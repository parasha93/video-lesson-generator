// Конфигурация (замените на свой токен)
const HF_TOKEN = "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";

// Элементы DOM
const topicInput = document.getElementById('topic');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const lessonText = document.getElementById('lesson-text');
const mouth = document.getElementById('avatar-mouth');

// 1. Генерация текста урока через Hugging Face
async function generateLessonText(topic) {
    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: `Создай подробный конспект урока на тему: ${topic}` })
            }
        );
        
        const result = await response.json();
        return result[0]?.generated_text || "Не удалось сгенерировать текст урока";
    } catch (error) {
        console.error("Ошибка генерации:", error);
        return "Произошла ошибка при генерации урока";
    }
}

// 2. Синтез речи через Web Speech API
function speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    
    // Анимация рта
    let isOpen = false;
    const mouthInterval = setInterval(() => {
        mouth.style.height = isOpen ? '10px' : '30px';
        isOpen = !isOpen;
    }, 200);

    utterance.onend = () => {
        clearInterval(mouthInterval);
        mouth.style.height = '10px';
    };

    synth.speak(utterance);
}

// 3. Генерация видео (эмуляция)
async function generateVideo(script) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`data:video/mp4;base64,${btoa(script)}`); // Эмуляция
        }, 3000);
    });
}

// Основная функция
generateBtn.addEventListener('click', async () => {
    const topic = topicInput.value.trim();
    if (!topic) return alert('Введите тему урока!');

    generateBtn.disabled = true;
    generateBtn.textContent = 'Генерация...';

    // 1. Получаем текст урока
    const script = await generateLessonText(topic);
    lessonText.innerHTML = `<p>${script.replace(/\n/g, '<br>')}</p>`;

    // 2. Озвучиваем
    speakText(script);

    // 3. Генерируем видео (в реальном проекте используйте ffmpeg.wasm)
    const videoUrl = await generateVideo(script);
    
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `${topic.replace(/\s+/g, '_')}_урок.mp4`;
        a.click();
    };

    generateBtn.disabled = false;
    generateBtn.textContent = 'Создать видеоурок';
});