function HashtagTable({ hashtags }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Nr.</th>
                    <th>Hashtag</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                {hashtags.map((hashtag, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{hashtag._id}</td>
                            <td>{hashtag.count}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default HashtagTable;