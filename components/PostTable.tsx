function PostTable({ posts }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => {
                    return (
                        <tr key={post._id}>
                            <td>{post._id}</td>
                            <td>{post.title}</td>
                            <td>{post.content}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default PostTable;