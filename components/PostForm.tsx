function PostForm() {
    return (
        <form action="/api/posts" method="post">
            <input name="title" type="text" placeholder="Title" required />
            <br />
            <textarea name="content" placeholder="Content" required />
            <br />
            <input type="submit" value="Submit" />
            <input type="reset" value="Reset" />
        </form>
    );
}

export default PostForm;