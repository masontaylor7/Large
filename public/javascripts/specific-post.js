window.addEventListener("DOMContentLoaded", (event)=>{
    console.log("hello from javascript!")
    const commentButton = document.querySelector('.comment-button');
    commentButton.addEventListener("click", async (event) => {
        // console.log("Does this work?");
        const id = parseInt(window.location.pathname.split("/")[2], 10);
        const fetchUrl = `/posts/${id}/comments`;
        const res = await fetch(`${fetchUrl}`);
        const comments = await res.json();
        const commentsSidebar = document.createElement('div');
        commentsSidebar.classList.add('comments-sidebar');
        const totalBody = document.querySelector('.total-body');
        const changeOpacity = document.querySelector('.change-opacity');
        totalBody.append(commentsSidebar);
        changeOpacity.style.opacity = 0.5;
        commentsSidebar.innerHTML = `
            <div class="upper-comment-section">
                <div class="form-box">
                    <textarea name="content" id="contentss" placeholder="Got something to say???" class="comment-text-area"></textarea>
                    <button class="comment-submit-button">Comment</button>
                </div>
                <div>
                    <img src='../imgs/x-image.png' class='x-image'>
                </div>
            </div>
        `;
        const getDate = (date) => {
            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }
        const exitButton = document.querySelector('.x-image')
        exitButton.addEventListener("click", (event) => {
            commentsSidebar.remove();
            changeOpacity.style.opacity = 1;
        });
        const lowerCommentSection = document.createElement('div');
        lowerCommentSection.classList.add('lower-comment-section');
        commentsSidebar.append(lowerCommentSection);
        comments.forEach((comment) => {
                const singleCommentDiv = document.createElement('div');
                singleCommentDiv.classList.add('single-comment-div');
                singleCommentDiv.id = `${comment.id}`;
                const date = getDate(new Date(comment.updatedAt));
            singleCommentDiv.innerHTML = `
                    <div class="comment-author-container">
                        <div class="main-comment-intro">
                            <img src="../imgs/profile-icon.png" class="comment-user-image">
                            <div class="comment-author-text">
                                <p class="comment-username">${comment.User.username}</p>
                                <p class="comment-date">${date}</p>
                            </div>
                        </div>
                        <div class="button-container">
                            <img src="../imgs/edit-97.png" class="edit-button-small">
                            <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
                        </div>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                `;
                lowerCommentSection.append(singleCommentDiv);
            });
            const commentSubmitButton = document.querySelector('.comment-submit-button');
            const commentContent = document.getElementById('contentss');
            console.log("commentContent is ", commentContent.value);
        commentSubmitButton.addEventListener("click", async (event) =>{
            // console.log(JSON.stringify(commentContent.value));
            let res = await fetch(`/posts/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment: commentContent.value })
            });
            // const res = await fetch(`${fetchUrl}`);
            console.log(res);
            const comment = await res.json();
            console.log(comment);
            // const result = await fetch(`${fetchUrl}`, ({
            //     where: {
            //         id: comment.id
            //     }
            // }));
            // const newComment = await result.json();
            let user = await fetch(`/users`);
            user = await user.json();
            const newCommentDiv = document.createElement('div');
                newCommentDiv.classList.add('single-comment-div');
                newCommentDiv.id = `${comment.id}`;
                const date = getDate(new Date(comment.updatedAt));
                newCommentDiv.innerHTML = `
                    <div class="comment-author-container">
                        <div class="main-comment-intro">
                            <img src="../imgs/profile-icon.png" class="comment-user-image">
                            <div class="comment-author-text">
                                <p class="comment-username">${user.username}</p>
                                <p class="comment-date">${date}</p>
                            </div>
                        </div>
                        <div class="button-container">
                            <img src="../imgs/edit-97.png" class="edit-button-small">
                            <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
                        </div>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                `;
                lowerCommentSection.prepend(newCommentDiv);
                commentContent.value = "";
        });
        const deleteCommentButton = document.querySelector(".delete-button-small");
        console.log(deleteCommentButton);
        deleteCommentButton.addEventListener("click", async(event) => {
            let commentId = deleteCommentButton.id;
            console.log("commentId is ", commentId);
            commentId = commentId.split("-")[1];
            const res = await fetch(`/comments/${commentId}`, {
                method: "DELETE"
            });
            console.log("res is ", res);
            const data = await res.json();
            if (data.message === "Success!") {
                document.getElementById(commentId).remove();
            }
        });




                const editButton = document.querySelector('.edit-button-small');
                editButton.addEventListener('click', async(event)=> {
                    const res = await fetch(`/comments/${comment.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ comment: commentContent.value })
                    })

                    const resBody = await res.json();
                    console.log(resBody);
                })
        });






    });

// <input type="hidden" name="_csrf" value="${csrfToken}">
