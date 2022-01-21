window.addEventListener("DOMContentLoaded", (event)=>{
    console.log("hello from javascript!")
    const commentButton = document.querySelector('.comment-button');
    commentButton.addEventListener("click", async (event) => {
        // console.log("Does this work?");
        const id = window.location.pathname
        console.log(window.location.pathname)
        const res = await fetch(`${id}/comments`);
        const comments = await res.json()
        console.log(comments)
        const commentsSidebar = document.createElement('div');
        commentsSidebar.classList.add('comments-sidebar');
        const totalBody = document.querySelector('.total-body');
        const changeOpacity = document.querySelector('.change-opacity');
        totalBody.append(commentsSidebar);
        changeOpacity.style.opacity = 0.5;
        commentsSidebar.innerHTML = `
        <div class="upper-comment-section">
            <div class="form-box">
                <form action="/comments" method="post">
                    <textarea placeholder="Got something to say???" class="comment-text-area"></textarea>
                    <button class="comment-submit-button">Comment</button>
                </form>
            </div>
            <div>
                <img src='../imgs/x-image.png' class='x-image'>
            </div>
        </div>
        `;


    });
})
