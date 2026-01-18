document.addEventListener("DOMContentLoaded", function() {
    const sidebarList = document.querySelector('.sidebar-list');
    const commentList = document.querySelector('.comment-list');
    const mainTitle = document.querySelector('.main-video-title');
    const videoStats = document.querySelector('.video-stats');
    const description = document.querySelector('.description');
    const urlInput = document.querySelector('.url-input');
    const videoScreen = document.querySelector('.video-screen');
    const commentsHeader = document.querySelector('.comments-header h4');
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    const commentInput = document.querySelector('.comment-textarea');
    const postBtn = document.querySelector('.post-btn');
    let likeCount = 0, dislikeCount = 0;

    // Carregar dados do JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Renderizar Barra Lateral
            sidebarList.innerHTML = '';
            data.forEach(video => {
                const item = document.createElement('div');
                item.className = 'side-item';
                item.dataset.videoId = video.id;
                
                item.innerHTML = `
                    <div class="thumb-box">
                        <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="Thumbnail">
                        <span class="duration">${video.duration}</span>
                    </div>
                    <div class="side-text">
                        <div class="side-v-title">${video.title}</div>
                        <div class="side-v-author">${video.author}</div>
                        <div class="side-v-views">${video.views}</div>
                    </div>
                `;
                
                item.addEventListener('click', () => loadVideo(video));
                sidebarList.appendChild(item);
            });

            // Carregar o primeiro vídeo (Justin Timberlake) por padrão
            const initialVideo = data.find(v => v.id === 'TOrnUquxtwA') || data[0];
            loadVideo(initialVideo);
        })
        .catch(err => console.error("Erro ao carregar JSON. Certifique-se de usar um servidor local (Live Server).", err));

    function loadVideo(video) {
        // Atualizar Informações Principais
        mainTitle.textContent = video.title;
        videoStats.innerHTML = `From: <a href="#" class="author-link">${video.author}</a> | <span class="video-date">${video.date}</span> | <strong>${video.views}</strong>`;
        description.textContent = video.description;
        
        // Atualizar URL Box
        urlInput.value = `https://www.youtube.com/watch?v=${video.id}`;
        
        // Atualizar Player
        // Usar tag de vídeo HTML5 para arquivos locais MP4
        videoScreen.innerHTML = `
            <video width="100%" height="100%" controls autoplay style="background: #000;">
                <source src="videos/${video.id}.mp4" type="video/mp4">
                Seu navegador não suporta a reprodução de vídeo.
            </video>
        `;

        // Atualizar Comentários
        commentsHeader.textContent = `Text Comments (${video.comments.length})`;
        commentList.innerHTML = '';
        video.comments.forEach(comment => {
            const commentHtml = `
                <div class="comment-item">
                    <img src="${comment.profilePic}" class="comment-avatar" alt="Avatar">
                    <div class="comment-content">
                        <div class="comment-meta"><a href="#" class="comment-author">${comment.author}</a> <span class="comment-time">${comment.time}</span></div>
                        <p class="comment-text">${comment.text}</p>
                        <button class="reply-action-btn">Reply</button>
                        <div class="reply-form-container" style="display:none;">
                            <textarea class="reply-textarea" placeholder="Add a reply..."></textarea>
                            <button class="post-reply-btn">Post Reply</button>
                        </div>
                    </div>
                </div>`;
            commentList.insertAdjacentHTML('beforeend', commentHtml);
        });

        // Atualizar Estado Ativo na Barra Lateral
        document.querySelectorAll('.side-item').forEach(item => {
            item.classList.remove('active-video');
            if(item.dataset.videoId === video.id) item.classList.add('active-video');
        });
    }

     // Like/Dislike functionality
     likeBtn.addEventListener('click', () => {
        likeCount++;
        likeBtn.querySelector('.like-count').textContent = likeCount;
    });

    dislikeBtn.addEventListener('click', () => {
        dislikeCount++;
        dislikeBtn.querySelector('.dislike-count').textContent = dislikeCount;
    });

    // Post Comment functionality
    postBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            const commentHtml = `
                <div class="comment-item">
                    <img src="https://i.pravatar.cc/150?u=You" class="comment-avatar" alt="Avatar">
                    <div class="comment-content">
                        <div class="comment-meta"><a href="#" class="comment-author">You</a> <span class="comment-time">Just now</span></div>
                        <p class="comment-text">${text}</p>
                        <button class="reply-action-btn">Reply</button>
                        <div class="reply-form-container" style="display:none;">
                            <textarea class="reply-textarea" placeholder="Add a reply..."></textarea>
                            <button class="post-reply-btn">Post Reply</button>
                        </div>
                    </div>
                </div>`;
            commentList.insertAdjacentHTML('afterbegin', commentHtml);
            commentInput.value = '';

            // Update count
            const currentCount = parseInt(commentsHeader.textContent.replace(/\D/g, '')) || 0;
            commentsHeader.textContent = `Text Comments (${currentCount + 1})`;
        }
    });

    // Reply functionality (Event Delegation)
    commentList.addEventListener('click', (e) => {
        // Toggle Reply Form
        if (e.target.classList.contains('reply-action-btn')) {
            const formContainer = e.target.nextElementSibling;
            formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
        }

        // Post Reply
        if (e.target.classList.contains('post-reply-btn')) {
            const btn = e.target;
            const container = btn.parentElement;
            const textarea = container.querySelector('.reply-textarea');
            const text = textarea.value.trim();

            if (text) {
                const replyHtml = `
                    <div class="comment-item reply-item">
                        <img src="https://i.pravatar.cc/150?u=You" class="comment-avatar" style="width:30px; height:30px;" alt="Avatar">
                        <div class="comment-content">
                            <div class="comment-meta"><a href="#" class="comment-author">You</a> <span class="comment-time">Just now</span></div>
                            <p class="comment-text">${text}</p>
                        </div>
                    </div>`;
                
                container.insertAdjacentHTML('beforebegin', replyHtml);
                textarea.value = '';
                container.style.display = 'none';
            }
        }
    });
});