
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
    const apiKey = "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"; // Clave de API para pruebas

    document.getElementById('chatbot-toggle').addEventListener('click', function () {
        const chatbotContainer = document.getElementById('chatbot-container');
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('chatbot-send').addEventListener('click', async function () {
        const input = document.getElementById('chatbot-input');
        const message = input.value;
    
        if (message.trim() !== '') {
            addMessage('Usuario: ' + message);
            input.value = ''; // Limpia el input
    
            try {
                // Llamada a la API de OpenAI
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}` // Aquí se corrige la inclusión de la clave API
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: message }],
                        temperature: 0.7
                    })
                });
    
                // Verificar el estado de la respuesta
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error en la API: ${response.status} ${response.statusText} - ${errorData.error.message}`);
                }
    
                const data = await response.json();
    
                // Verificar que la respuesta tenga datos
                if (data.choices && data.choices.length > 0) {
                    addMessage('Bot: ' + data.choices[0].message.content);
                } else {
                    throw new Error('La API no devolvió una respuesta válida.');
                }
            } catch (error) {
                // Mostrar el error específico
                addMessage('Bot: Hubo un error al procesar la solicitud. Detalles del error: ' + error.message);
                console.error('Error detallado:', error);  // Mostrar el error completo en la consola
            }
        }
    });
    
    function addMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Desplazar hacia abajo
    }
    