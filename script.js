document.addEventListener("DOMContentLoaded", function() {
    const sidebarList = document.querySelector('.sidebar-list');
    const commentList = document.querySelector('.comment-list');
    const mainTitle = document.querySelector('.main-video-title');
    const videoStats = document.querySelector('.video-stats');
    const description = document.querySelector('.description');
    const videoScreen = document.querySelector('.video-screen');
    const commentsHeader = document.querySelector('.comments-header h4');
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const shareBtn = document.querySelector('.share-btn');
    const commentInput = document.querySelector('.comment-textarea');
    const postBtn = document.querySelector('.post-btn');
    let currentLikes = 0, currentDislikes = 0;
    let hasLiked = false, hasDisliked = false;
    let currentVideoId = null;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            sidebarList.innerHTML = '';
            data.forEach(video => {
                const item = document.createElement('div');
                item.className = 'side-item';
                item.dataset.videoId = video.id;
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                
                item.innerHTML = `
                    <div class="thumb-box">
                        <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="">
                        <span class="duration">${video.duration}</span>
                    </div>
                    <div class="side-text">
                        <div class="side-v-title">${video.title}</div>
                        <div class="side-v-author">${video.author}</div>
                        <div class="side-v-views">${video.views}</div>
                    </div>
                `;
                
                item.addEventListener('click', () => loadVideo(video));
                
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        loadVideo(video);
                    }
                });
                sidebarList.appendChild(item);
            });

            const initialVideo = data.find(v => v.id === 'TOrnUquxtwA') || data[0];
            loadVideo(initialVideo);
        })
        .catch(err => {
            console.error("Erro ao carregar JSON.", err);
            alert("Erro: A lista de vídeos não apareceu.\n\nSe você abriu o arquivo direto pelo Windows, o navegador bloqueia o 'data.json'.\n\nUse a extensão 'Live Server' no VS Code (botão direito no index.html -> Open with Live Server).");
        });

    function loadVideo(video) {
        currentVideoId = video.id;
        mainTitle.textContent = video.title;
        videoStats.innerHTML = `From: <a href="#" class="author-link">${video.author}</a> | <span class="video-date">${video.date}</span> | <strong>${video.views}</strong>`;
        description.textContent = video.description;
        
        currentLikes = video.likes || 0;
        currentDislikes = video.dislikes || 0;
        hasLiked = false;
        hasDisliked = false;
        
        likeBtn.querySelector('.like-count').textContent = currentLikes.toLocaleString();
        dislikeBtn.querySelector('.dislike-count').textContent = currentDislikes.toLocaleString();

        videoScreen.innerHTML = '';

        const videoEl = document.createElement('video');
        videoEl.style.width = '100%';
        videoEl.style.height = '100%';
        videoEl.style.background = '#000';
        videoEl.controls = true;
        videoEl.autoplay = true;

        const sourceEl = document.createElement('source');
        sourceEl.src = `assets/videos/${video.id}.mp4`;
        sourceEl.type = 'video/mp4';

        sourceEl.addEventListener('error', () => {
            videoScreen.innerHTML = `
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; color: white; text-align: center;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">⚠️ Vídeo não encontrado</p>
                    <p>O sistema procurou por: <br><code style="background: #333; padding: 2px 5px;">videos/${video.id}.mp4</code></p>
                    <p style="font-size: 12px; margin-top: 10px; color: #aaa;">Verifique se a pasta 'videos' existe e se o nome do arquivo está correto.</p>
                </div>
            `;
        });

        videoEl.appendChild(sourceEl);
        videoScreen.appendChild(videoEl);

        var playPromise = videoEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                videoEl.muted = true;
                videoEl.play();
            });
        }

        commentsHeader.textContent = `Text Comments (${video.comments.length})`;
        commentList.innerHTML = '';
        video.comments.forEach(comment => {
            const commentHtml = `
                <div class="comment-item">
                    <img src="${comment.profilePic}" class="comment-avatar" alt="${comment.author}'s avatar">
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

        document.querySelectorAll('.side-item').forEach(item => {
            item.classList.remove('active-video');
            if(item.dataset.videoId === video.id) item.classList.add('active-video');
        });
    }

     likeBtn.addEventListener('click', () => {
        if (hasLiked) {
            currentLikes--;
            hasLiked = false;
        } else {
            currentLikes++;
            hasLiked = true;
            if (hasDisliked) {
                currentDislikes--;
                hasDisliked = false;
                dislikeBtn.querySelector('.dislike-count').textContent = currentDislikes.toLocaleString();
            }
        }
        likeBtn.querySelector('.like-count').textContent = currentLikes.toLocaleString();
    });

    dislikeBtn.addEventListener('click', () => {
        if (hasDisliked) {
            currentDislikes--;
            hasDisliked = false;
        } else {
            currentDislikes++;
            hasDisliked = true;
            if (hasLiked) {
                currentLikes--;
                hasLiked = false;
                likeBtn.querySelector('.like-count').textContent = currentLikes.toLocaleString();
            }
        }
        dislikeBtn.querySelector('.dislike-count').textContent = currentDislikes.toLocaleString();
    });

    subscribeBtn.addEventListener('click', () => {
        if (subscribeBtn.classList.contains('subscribed')) {
            subscribeBtn.classList.remove('subscribed');
            subscribeBtn.textContent = 'Subscribe';
        } else {
            subscribeBtn.classList.add('subscribed');
            subscribeBtn.textContent = 'Subscribed';
        }
    });

    shareBtn.addEventListener('click', () => {
        if (currentVideoId) {
            const url = `https://www.youtube.com/watch?v=${currentVideoId}`;
            navigator.clipboard.writeText(url).then(() => {
                alert(`Link copiado para a área de transferência:\n${url}`);
            }).catch(err => console.error('Erro ao copiar link', err));
        }
    });

    postBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            const commentHtml = `
                <div class="comment-item">
                    <img src="https://i.pravatar.cc/150?u=You" class="comment-avatar" alt="Your avatar">
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

            const currentCount = parseInt(commentsHeader.textContent.replace(/\D/g, '')) || 0;
            commentsHeader.textContent = `Text Comments (${currentCount + 1})`;
        }
    });

    commentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('reply-action-btn')) {
            const formContainer = e.target.nextElementSibling;
            formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
        }

        if (e.target.classList.contains('post-reply-btn')) {
            const btn = e.target;
            const container = btn.parentElement;
            const textarea = container.querySelector('.reply-textarea');
            const text = textarea.value.trim();

            if (text) {
                const replyHtml = `
                    <div class="comment-item reply-item">
                        <img src="https://i.pravatar.cc/150?u=You" class="comment-avatar" style="width:30px; height:30px;" alt="Your avatar">
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