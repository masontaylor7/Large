
window.addEventListener("DOMContentLoaded", async(event)=>{
    console.log("hello from javascript!")

    const commentButton = document.querySelector('.comment-button');
    commentButton.addEventListener("click", async () => {
        const id = parseInt(window.location.pathname.split("/")[2], 10);
        const fetchUrl = `/posts/${id}/comments`;
        const res = await fetch(`${fetchUrl}`);
        const comments = await res.json();
        console.log('ALL OUR COMMENTS', comments)
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
                    <button class="comment-update-button hidden-mode">Update</button>
                </div>
                <div>
                    <img src='../imgs/x-image.png' class='x-image'>
                </div>
            </div>
            `;

        let user = await getUser();
        const lowerCommentSection = document.createElement('div');
        lowerCommentSection.classList.add('lower-comment-section');
        commentsSidebar.append(lowerCommentSection);
        comments.forEach((comment) => {
                const singleCommentDiv = document.createElement('div');
                singleCommentDiv.classList.add('single-comment-div');
                singleCommentDiv.id = `div-${comment.id}`;
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
                        <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
                        <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
                    </div>
                </div>
                <p class="comment-text" id='text-${comment.id}'>${comment.content}</p>
            `;
            lowerCommentSection.append(singleCommentDiv);
            if (user.id !== comment.userId){
                const edit = document.querySelector(`#edit-${comment.id}`);
                console.log('THIS IS EDIT', edit);
                const deleteButton = document.getElementById(`delete-${comment.id}`);


                edit.classList.add(`hidden-mode`);
                deleteButton.classList.add(`hidden-mode`);
            }

        });
        const deleteButtons = document.querySelectorAll(".delete-button-small");
        console.log("deleteButtons, ", deleteButtons)
        deleteComment(deleteButtons);
        const editButtons = document.querySelectorAll('.edit-button-small');
        console.log("editButtons, ", editButtons)
        editButtonFunction(editButtons, lowerCommentSection);
        const updateButton = document.querySelector(".comment-update-button");
        updateButton.addEventListener('click', async(event) => {
            const commentId = event.target.id;
            event.stopPropagation();

            const res = await fetch(`/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment: commentContent.value})
            })

            const resBody = await res.json();
            if (resBody === "Comment can't be empty.") {
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('errors');
                errorDiv.innerHTML = resBody;
                document.querySelector('.form-box').append(errorDiv);
                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);

            } else {

            const updatedComment = document.querySelector(".comment-submit-button")
            updatedComment.classList.remove('hidden-mode');
            updateButton.classList.add('hidden-mode');
            const newCommentDiv = document.createElement('div');
            newCommentDiv.classList.add('single-comment-div');
            newCommentDiv.id = `div-${commentId}`;

            const date = getDate(new Date(resBody.specifiComment.updatedAt));

            let user = await getUser();

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
                            <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${commentId}'>
                            <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${commentId}">
                        </div>
                    </div>
                    <p class="comment-text" id='text-${commentId}'>${commentContent.value}</p>
                `;

                lowerCommentSection.prepend(newCommentDiv);
                commentContent.value = "";
                const deleteCommentButtons = document.querySelector(".delete-button-small");
                deleteComment([deleteCommentButtons]);
                const editButtons = document.querySelector('.edit-button-small');
                editButtonFunction([editButtons], lowerCommentSection)

        }});

        const exitButton = document.querySelector('.x-image')
        exitButton.addEventListener("click", (event) => {

            commentsSidebar.remove();
            changeOpacity.style.opacity = 1;
        });


        const commentSubmitButton = document.querySelector('.comment-submit-button');
        const commentContent = document.getElementById('contentss');
        console.log("commentContent is ", commentContent.value);
        commentSubmitButton.addEventListener("click", async (event) =>{

            let res = await fetch(`/posts/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment: commentContent.value })
            });

            console.log(res);
            const comment = await res.json();
            console.log(comment);
            if (comment === "Comment can't be empty.") {
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('errors');
                errorDiv.innerHTML = comment;
                document.querySelector('.form-box').append(errorDiv);
                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);

            } else {
                // const errorDiv = document.querySelector('.errors');
                // if (errorDiv) {
                //     errorDiv.remove();
                // }
                const newCommentDiv = document.createElement('div');
                newCommentDiv.classList.add('single-comment-div');
                newCommentDiv.id = `div-${comment.id}`;
                const date = getDate(new Date(comment.updatedAt));
                let user = await getUser();
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
                            <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
                            <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
                        </div>
                    </div>
                    <p class="comment-text" id='text-${comment.id}'>${comment.content}</p>
                `;
                lowerCommentSection.prepend(newCommentDiv);
                commentContent.value = "";






                const deleteCommentButtons = document.querySelector(".delete-button-small");
                deleteComment([deleteCommentButtons]);


                const editButtons = document.querySelector('.edit-button-small');
                editButtonFunction([editButtons], lowerCommentSection);
        }});
                });

});








async function getUser(){
    let user = await fetch(`/users`);
    user = await user.json();
    return user;
}

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



const deleteComment = async (deleteCommentButtons) => {
    deleteCommentButtons.forEach(button => {
        button.addEventListener("click", async(event) => {
            event.stopPropagation();
            let commentId = button.id;

            commentId = commentId.split("-")[1];
            const res = await fetch(`/comments/${commentId}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (data.message === "Success!") {
                console.log(document.getElementById(`div-${commentId}`));
                document.querySelector(`#div-${commentId}`).remove();
            }
        });
    });
};


const editButtonFunction = (editButtons, lowerCommentSection) => {
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', (event)=> {
            event.stopPropagation();

            const commentId = editButton.id.split('-')[1];
            console.log('this worked', commentId)


            const commentText = document.getElementById(`text-${commentId}`);
            const commentContent = document.getElementById('contentss');
            commentContent.value = commentText.innerText;

            const commentDiv = document.getElementById(`div-${commentId}`);
            commentDiv.remove();


            const updatedComment = document.querySelector('.comment-submit-button');
            updatedComment.classList.add('hidden-mode');
            const updateButton = document.querySelector(".comment-update-button");
            updateButton.classList.remove('hidden-mode');
            updateButton.classList.add('submit-edit-button');
            updateButton.id = `${commentId}`
        });
    });
}
