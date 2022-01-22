
window.addEventListener("DOMContentLoaded", async(event)=>{
    console.log("hello from javascript!")

    const commentButton = document.querySelector('.comment-button');
    commentButton.addEventListener("click", async () => {
        // console.log("Does this work?");
        // event.stopPropagation();
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
                </div>
                <div>
                    <img src='../imgs/x-image.png' class='x-image'>
                </div>
            </div>
        `;

        const lowerCommentSection = document.createElement('div');
        lowerCommentSection.classList.add('lower-comment-section');
        commentsSidebar.append(lowerCommentSection);
        comments.forEach(async(comment) => {
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

                let user = await getUser();
                if (user.id !== comment.userId){
                    const edit = document.querySelector(`#edit-${comment.id}`);
                    console.log('THIS IS EDIT', edit);
                    const deleteButton = document.getElementById(`delete-${comment.id}`);


                    edit.classList.add(`hidden-mode`);
                    deleteButton.classList.add(`hidden-mode`);
                }
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

            console.log(res);
            const comment = await res.json();
            console.log(comment);

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






                const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
                deleteComment(deleteCommentButtons);


                const editButtons = document.querySelectorAll('.edit-button-small');
                editButtons.forEach(editButton => {
                    editButton.addEventListener('click', async(event)=> {
                        // event.stopPropagation();

                        const commentId = editButton.id.split('-')[1];
                        console.log('this worked', commentId)


                        const commentText = document.getElementById(`text-${commentId}`);

                        commentContent.value = commentText.innerText;

                        const commentDiv = document.getElementById(`div-${commentId}`);
                        commentDiv.remove();


                        const updatedComment = document.querySelector('.comment-submit-button');
                        updatedComment.classList.add('hidden-mode');
                        const updateButton = document.createElement('button');
                        updateButton.classList.remove('hidden-mode');
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
                                updatedComment.classList.remove('hidden-mode');
                                updateButton.classList.add('hidden-mode');
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
                                    <p class="comment-text" id='text-${comment.id}'>${commentContent.value}</p>
                                `;
                                lowerCommentSection.prepend(newCommentDiv);
                                commentContent.value = "";
                                const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
                                deleteComment(deleteCommentButtons);
                                const editButtons = document.querySelectorAll('.edit-button-small');
                                editButtonFunction(editButtons, lowerCommentSection);

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



        });




        const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
            deleteComment(deleteCommentButtons);
    });



        const editButtons = document.querySelectorAll('.edit-button-small');
        editButtons.forEach(editButton => {
            editButton.addEventListener('click', async(event)=> {
                // event.stopPropagation();

                const commentId = editButton.id.split('-')[1];
                console.log('this worked', commentId)


                const commentText = document.getElementById(`text-${commentId}`);

                commentContent.value = commentText.innerText;

                const commentDiv = document.getElementById(`div-${commentId}`);
                commentDiv.remove();


                const updatedComment = document.querySelector('.comment-submit-button');
                updatedComment.classList.add('hidden-mode');
                const updateButton = document.createElement('button');
                updateButton.classList.remove('hidden-mode');
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
                        updatedComment.classList.remove('hidden-mode');
                        updateButton.classList.add('hidden-mode');
                        const newCommentDiv = document.createElement('div');
                        newCommentDiv.classList.add('single-comment-div');
                        newCommentDiv.id = `${commentId}`;
                        const date = getDate(new Date(resBody.updatedAt));
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
                        const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
                        deleteComment(deleteCommentButtons);
                        const editButtons = document.querySelectorAll('.edit-button-small');
                        editButtonFunction(editButtons);

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





});

async function getUser(){
    let user = await fetch(`/users`);
    user = await user.json();
    console.log(user);
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
            // event.stopPropagation();
            let commentId = button.id;

            commentId = commentId.split("-")[1];
            const res = await fetch(`/comments/${commentId}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (data.message === "Success!") {
                document.getElementById(`div-${commentId}`).remove();
            }
        });
    });
}




const editButtonFunction = async(editButtons, lowerCommentSection) => {
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async(event)=> {
            // event.stopPropagation();

            const commentId = editButton.id.split('-')[1];
            console.log('this worked', commentId)


            const commentText = document.getElementById(`text-${commentId}`);
            const commentContent = document.getElementById('contentss');
            commentContent.value = commentText.innerText;

            const commentDiv = document.getElementById(`div-${commentId}`);
            commentDiv.remove();


            const updatedComment = document.querySelector('.comment-submit-button');
            updatedComment.classList.add('hidden-mode');
            const updateButton = document.createElement('button');
            updateButton.classList.remove('hidden-mode');
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
                    updatedComment.classList.remove('hidden-mode');
                    updateButton.classList.add('hidden-mode');
                    const newCommentDiv = document.createElement('div');
                    newCommentDiv.classList.add('single-comment-div');
                    newCommentDiv.id = `div-${commentId}`;
                    const date = getDate(new Date(resBody.updatedAt));
                    console.log(date);
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
                    const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
                    deleteComment(deleteCommentButtons);
                    const editButtons = document.querySelectorAll('.edit-button-small');
                    editButtonFunction(editButtons, lowerCommentSection)
                });
        });
    });
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



// const functionComment = async() => {
//     // console.log("Does this work?");
//     // event.stopPropagation();
//     const id = parseInt(window.location.pathname.split("/")[2], 10);
//     const fetchUrl = `/posts/${id}/comments`;
//     const res = await fetch(`${fetchUrl}`);
//     const comments = await res.json();
//     const commentsSidebar = document.createElement('div');
//     commentsSidebar.classList.add('comments-sidebar');
//     const totalBody = document.querySelector('.total-body');
//     const changeOpacity = document.querySelector('.change-opacity');
//     totalBody.append(commentsSidebar);
//     changeOpacity.style.opacity = 0.5;
//     commentsSidebar.innerHTML = `
//         <div class="upper-comment-section">
//             <div class="form-box">
//                 <textarea name="content" id="contentss" placeholder="Got something to say???" class="comment-text-area"></textarea>
//                 <button class="comment-submit-button">Comment</button>
//             </div>
//             <div>
//                 <img src='../imgs/x-image.png' class='x-image'>
//             </div>
//         </div>
//     `;
//     const getDate = (date) => {
//         const months = [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//             'Oct',
//             'Nov',
//             'Dec'
//         ];
//         return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
//     }

//     const lowerCommentSection = document.createElement('div');
//     lowerCommentSection.classList.add('lower-comment-section');
//     commentsSidebar.append(lowerCommentSection);
//     comments.forEach(async(comment) => {
//             const singleCommentDiv = document.createElement('div');
//             singleCommentDiv.classList.add('single-comment-div');
//             singleCommentDiv.id = `div-${comment.id}`;
//             const date = getDate(new Date(comment.updatedAt));
//         singleCommentDiv.innerHTML = `
//                 <div class="comment-author-container">
//                     <div class="main-comment-intro">
//                         <img src="../imgs/profile-icon.png" class="comment-user-image">
//                         <div class="comment-author-text">
//                             <p class="comment-username">${comment.User.username}</p>
//                             <p class="comment-date">${date}</p>
//                         </div>
//                     </div>
//                     <div class="button-container">
//                         <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
//                         <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
//                     </div>
//                 </div>
//                 <p class="comment-text" id='text-${comment.id}'>${comment.content}</p>
//             `;
//             // let user = await fetch(`/users`);
//             // user = await user.json();
//             if (user.id !== comment.userId){
//                 const edit = document.getElementById(`edit-${comment.id}`);
//                 const deleteButton = document.getElementById(`delete-${comment.id}`);

//                 edit.classList.add(`hidden-mode`);
//                 deleteButton.classList.add(`hidden-mode`);
//             }

//             lowerCommentSection.append(singleCommentDiv);


//     });

//     const exitButton = document.querySelector('.x-image')
//     exitButton.addEventListener("click", (event) => {
//         // event.stopPropagation();
//         commentsSidebar.remove();
//         changeOpacity.style.opacity = 1;
//     });


//     const commentSubmitButton = document.querySelector('.comment-submit-button');
//     const commentContent = document.getElementById('contentss');
//     console.log("commentContent is ", commentContent.value);
//     commentSubmitButton.addEventListener("click", async (event) =>{
//         // event.stopPropagation();

//         // console.log(JSON.stringify(commentContent.value));
//         let res = await fetch(`/posts/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ comment: commentContent.value })
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
//             newCommentDiv.id = `div-${comment.id}`;
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
//                 <p class="comment-text" id='text-${comment.id}'>${comment.content}</p>
//             `;
//             lowerCommentSection.prepend(newCommentDiv);
//             commentContent.value = "";






//             const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
//             deleteCommentButtons.forEach(button => {
//                 button.addEventListener("click", async(event) => {
//                     // event.stopPropagation();

//                     let commentId = button.id;

//                     commentId = commentId.split("-")[1];
//                     const res = await fetch(`/comments/${commentId}`, {
//                         method: "DELETE"
//                     });

//                     const data = await res.json();


//                     if (data.message === "Success!") {
//                         document.getElementById(`div-${commentId}`).remove();
//                     }
//                 });
//             });


//             const editButtons = document.querySelectorAll('.edit-button-small');
//             editButtons.forEach(editButton => {
//                 editButton.addEventListener('click', async(event)=> {
//                     // event.stopPropagation();

//                     const commentId = editButton.id.split('-')[1];
//                     console.log('this worked', commentId)


//                     const commentText = document.getElementById(`text-${commentId}`);

//                     commentContent.value = commentText.innerText;

//                     const commentDiv = document.getElementById(`div-${commentId}`);
//                     commentDiv.remove();


//                     const updatedComment = document.querySelector('.comment-submit-button');
//                     updatedComment.classList.add('hidden-mode');
//                     const updateButton = document.createElement('button');
//                     updateButton.classList.remove('hidden-mode');
//                     updateButton.innerHTML= 'Update';
//                     updateButton.classList.add('submit-edit-button');
//                     const formBox = document.querySelector('.form-box');
//                     formBox.append(updateButton);



//                         updateButton.addEventListener('click', async(event) => {
//                             // event.stopPropagation();
//                             const res = await fetch(`/comments/${commentId}`, {
//                                 method: 'PUT',
//                                 headers: {
//                                     'Content-Type': 'application/json'
//                                 },
//                                 body: JSON.stringify({ comment: commentContent.value})
//                             })

//                             const resBody = await res.json();
//                             console.log(resBody);
//                             updatedComment.classList.remove('hidden-mode');
//                             updateButton.classList.add('hidden-mode');
//                             const newCommentDiv = document.createElement('div');
//                             newCommentDiv.classList.add('single-comment-div');
//                             newCommentDiv.id = `div-${comment.id}`;
//                             const date = getDate(new Date(comment.updatedAt));
//                             newCommentDiv.innerHTML = `
//                                 <div class="comment-author-container">
//                                     <div class="main-comment-intro">
//                                         <img src="../imgs/profile-icon.png" class="comment-user-image">
//                                         <div class="comment-author-text">
//                                             <p class="comment-username">${user.username}</p>
//                                             <p class="comment-date">${date}</p>
//                                         </div>
//                                     </div>
//                                     <div class="button-container">
//                                         <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${comment.id}'>
//                                         <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${comment.id}">
//                                     </div>
//                                 </div>
//                                 <p class="comment-text" id='text-${comment.id}'>${commentContent.value}</p>
//                             `;
//                             lowerCommentSection.prepend(newCommentDiv);
//                             commentContent.value = "";
//                             // const updatedComment = document.querySelector('.submit-edit-button');
//                             // updatedComment.remove();
//                             // const updateButton = document.createElement('button');
//                             // updateButton.innerHTML= 'Comment';
//                             // updateButton.classList.add('.comment-submit-button');
//                             // const formBox = document.querySelector('.form-box');
//                             // formBox.append(updateButton);


//                         });

//                         // const res = await fetch(`/comments/${commentId}`, {
//                         //     method: 'PUT',
//                         //     headers: {
//                         //         'Content-Type': 'application/json'
//                         //     },
//                         //     body: JSON.stringify({ comment: commentContent.value})
//                         // })

//                         // const resBody = await res.json();
//                         // console.log(resBody);
//                 });
//             });



//     });




//     const deleteCommentButtons = document.querySelectorAll(".delete-button-small");
//     console.log(deleteCommentButtons);
//     deleteCommentButtons.forEach(button => {
//         button.addEventListener("click", async(event) => {
//             // event.stopPropagation();
//             let commentId = button.id;

//             commentId = commentId.split("-")[1];
//             const res = await fetch(`/comments/${commentId}`, {
//                 method: "DELETE"
//             });

//             const data = await res.json();

//             if (data.message === "Success!") {
//                 document.getElementById(`div-${commentId}`).remove();
//             }
//         });
//     });



//     const editButtons = document.querySelectorAll('.edit-button-small');
//     editButtons.forEach(editButton => {
//         editButton.addEventListener('click', async(event)=> {
//             // event.stopPropagation();

//             const commentId = editButton.id.split('-')[1];
//             console.log('this worked', commentId)


//             const commentText = document.getElementById(`text-${commentId}`);

//             commentContent.value = commentText.innerText;

//             const commentDiv = document.getElementById(`div-${commentId}`);
//             commentDiv.remove();


//             const updatedComment = document.querySelector('.comment-submit-button');
//             updatedComment.classList.add('hidden-mode');
//             const updateButton = document.createElement('button');
//             updateButton.classList.remove('hidden-mode');
//             updateButton.innerHTML= 'Update';
//             updateButton.classList.add('submit-edit-button');
//             const formBox = document.querySelector('.form-box');
//             formBox.append(updateButton);



//                 updateButton.addEventListener('click', async(event) => {
//                     // event.stopPropagation();
//                     const res = await fetch(`/comments/${commentId}`, {
//                         method: 'PUT',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({ comment: commentContent.value})
//                     })

//                     const resBody = await res.json();
//                     console.log(resBody);
//                     updatedComment.classList.remove('hidden-mode');
//                     updateButton.classList.add('hidden-mode');
//                     const newCommentDiv = document.createElement('div');
//                     newCommentDiv.classList.add('single-comment-div');
//                     newCommentDiv.id = `${commentId}`;
//                     const date = getDate(new Date(resBody.updatedAt));
//                     let user = await fetch(`/users`);
//                     user = await user.json();
//                     newCommentDiv.innerHTML = `
//                         <div class="comment-author-container">
//                             <div class="main-comment-intro">
//                                 <img src="../imgs/profile-icon.png" class="comment-user-image">
//                                 <div class="comment-author-text">
//                                     <p class="comment-username">${user.username}</p>
//                                     <p class="comment-date">${date}</p>
//                                 </div>
//                             </div>
//                             <div class="button-container">
//                                 <img src="../imgs/edit-97.png" class="edit-button-small" id= 'edit-${commentId}'>
//                                 <img src="../imgs/delete-button-pngrepo-com.png" class="delete-button-small" id="delete-${commentId}">
//                             </div>
//                         </div>
//                         <p class="comment-text" id='text-${commentId}'>${commentContent.value}</p>
//                     `;
//                     lowerCommentSection.prepend(newCommentDiv);
//                     commentContent.value = "";

//                     // const updatedComment = document.querySelector('.submit-edit-button');
//                     // updatedComment.remove();
//                     // const updateButton = document.createElement('button');
//                     // updateButton.innerHTML= 'Comment';
//                     // updateButton.classList.add('.comment-submit-button');
//                     // const formBox = document.querySelector('.form-box');
//                     // formBox.append(updateButton);


//                 });

//                 // const res = await fetch(`/comments/${commentId}`, {
//                 //     method: 'PUT',
//                 //     headers: {
//                 //         'Content-Type': 'application/json'
//                 //     },
//                 //     body: JSON.stringify({ comment: commentContent.value})
//                 // })

//                 // const resBody = await res.json();
//                 // console.log(resBody);
//         });
//     });





// }
