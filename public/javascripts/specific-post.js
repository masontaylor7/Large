window.addEventListener("DOMContentLoaded", (event)=>{
    console.log("hello from javascript!")
    const commentButton = document.querySelector('.comment-button');
    commentButton.addEventListener("click", (event) => {
        console.log("Does this work?");
        const commentsSidebar = document.createElement('div');
        commentsSidebar.classList.add('comments-sidebar');
        const totalBody = document.querySelector('.total-body');
        const changeOpacity = document.querySelector('.change-opacity');
        totalBody.append(commentsSidebar);
        changeOpacity.style.opacity = 0.5;
        commentsSidebar.innerHTML = `
        <div>
            <form action="/comments" method="post">
                <textarea placeholder="Got something to say???"></textarea>
                <button>Comment</button>
            </form>
        </div>
        <div>
            <img src='../imgs/x-image.png' class='x-image'>
        </div>
        `;


    });
})
