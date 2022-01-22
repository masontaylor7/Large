

window.addEventListener("DOMContentLoaded", (event)=>{
    console.log("hello from javascript!")



    const commentButton = document.querySelector('.comment-button');
    commentButton.addEventListener("click", async (event) => {
        // console.log("Does this work?");
        // event.stopPropagation();
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

        const exitButton = document.querySelector('.x-image')
        exitButton.addEventListener("click", (event) => {
            // event.stopPropagation();
            commentsSidebar.remove();
            changeOpacity.style.opacity = 1;
        });


        const commentSubmitButton = document.querySelector('.comment-submit-button');
        const commentContent = document.getElementById('contentss');
        console.log("commentContent is ", commentContent.value);
        commentSubmitButton.addEventListener("click", async (event) =>{
            // event.stopPropagation();

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
                            <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
                            <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
                        </div>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                `;
                lowerCommentSection.prepend(newCommentDiv);
                commentContent.value = "";






                const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
                deleteCommentButtons.forEach(button => {
                    button.addEventListener("click", async(event) => {
                        // event.stopPropagation();

                        let commentId = button.id;

                        commentId = commentId.split("-")[1];
                        const res = await fetch(`/comments/${commentId}`, {
                            method: "DELETE"
                        });

                        const data = await res.json();


                        if (data.message === "Success!") {
                            document.getElementById(commentId).remove();
                        }
                    });
                });


                const editButton = document.querySelector('.edit-button-small');
                editButton.addEventListener('click', async(event)=> {
                    // event.stopPropagation();

                    const commentId = editButton.id.split('-')[1];
                    console.log('this worked', commentId)


                    const commentText = document.querySelector('.comment-text');

                    commentContent.value = commentText.innerText;

                    const commentDiv = document.getElementById(commentId);
                    commentDiv.remove();

                    const updatedComment = document.querySelector('.comment-submit-button');
                    updatedComment.remove();
                    const updateButton = document.createElement('button');
                    updateButton.innerHTML= 'Update';
                    updateButton.classList.add('submit-edit-button');
                    const formBox = document.querySelector('.form-box');
                    formBox.append(updateButton);



                        updateButton.addEventListener('click', async(event) => {
                            // event.stopPropagation();
                            const res = await fetch(`/comments/${commentId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ comment: commentContent.value})
                            })

                            const resBody = await res.json();
                            console.log(resBody);

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
                                        <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
                                        <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
                                    </div>
                                </div>
                                <p class="comment-text">${commentContent.value}</p>
                            `;
                            lowerCommentSection.prepend(newCommentDiv);
                            commentContent.value = "";

                            // const updatedComment = document.querySelector('.submit-edit-button');
                            // updatedComment.remove();
                            // const updateButton = document.createElement('button');
                            // updateButton.innerHTML= 'Comment';
                            // updateButton.classList.add('.comment-submit-button');
                            // const formBox = document.querySelector('.form-box');
                            // formBox.append(updateButton);


                        });

                        // const res = await fetch(`/comments/${commentId}`, {
                        //     method: 'PUT',
                        //     headers: {
                        //         'Content-Type': 'application/json'
                        //     },
                        //     body: JSON.stringify({ comment: commentContent.value})
                        // })

                        // const resBody = await res.json();
                        // console.log(resBody);
                });



        });




        const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
        console.log(deleteCommentButtons);
        deleteCommentButtons.forEach(button => {
            button.addEventListener("click", async(event) => {
                // event.stopPropagation();
                let commentId = button.id;

                commentId = commentId.split("-")[1];
                const res = await fetch(`/comments/${commentId}`, {
                    method: "DELETE"
                });

                const data = await res.json();

                if (data.message === "Success!") {
                    document.getElementById(commentId).remove();
                }
            });
        });





                // const editButton = document.querySelector('.edit-button-small');
                // editButton.addEventListener('click', async(event)=> {
                //     const commentId = event.id.split('-')[1];
                //     console.log('this worked', commentId)
                //     const res = await fetch(`/comments/${commentId}`, {
                //         method: 'PUT',
                //         headers: {
                //             'Content-Type': 'application/json'
                //         },
                //         body: JSON.stringify({ comment: commentContent.value })
                //     })

                //     const resBody = await res.json();
                //     console.log(resBody);
                // });
    });




});




const deleteComment = async (commentId) => {
    const res = await fetch(`/comments/${commentId}`, {
        method: "DELETE"
    });

    const data = await res.json();
    if (data.message === "Success!") {
        document.getElementById(commentId).remove();
    }
}
// <input type="hidden" name="_csrf" value="${csrfToken}">



// const createComment = async(commentContent) => {
//     const commentSubmitButton = document.querySelector('.comment-submit-button');
//     const commentContent = document.getElementById('contentss');
//     console.log("commentContent is ", commentContent);
//     commentSubmitButton.addEventListener("click", async (event) =>{
//         // console.log(JSON.stringify(commentContent));
//         let res = await fetch(`/posts/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ comment: commentContent })
//         });
//         // const res = await fetch(`${fetchUrl}`);
//         console.log(res);
//         const comment = await res.json();
//         console.log(comment);
//         // const result = await fetch(`${fetchUrl}`, ({
//         //     where: {
//         //         id: comment.id
//         //     }
//         // }));
//         // const newComment = await result.json();
//         let user = await fetch(`/users`);
//         user = await user.json();
//         const newCommentDiv = document.createElement('div');
//             newCommentDiv.classList.add('single-comment-div');
//             newCommentDiv.id = `${comment.id}`;
//             const date = getDate(new Date(comment.updatedAt));
//             newCommentDiv.innerHTML = `
//                 <div class="comment-author-container">
//                     <div class="main-comment-intro">
//                         <img src="../imgs/profile-icon.png" class="comment-user-image">
//                         <div class="comment-author-text">
//                             <p class="comment-username">${user.username}</p>
//                             <p class="comment-date">${date}</p>
//                         </div>
//                     </div>
//                     <div class="button-container">
//                         <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
//                         <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
//                     </div>
//                 </div>
//                 <p class="comment-text">${comment.content}</p>
//             `;
//             lowerCommentSection.prepend(newCommentDiv);
//             commentContent = "";
// }
