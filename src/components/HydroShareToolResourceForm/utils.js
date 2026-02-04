import AWS from "aws-sdk";


export const makeMarkdown = (title, abstract, authors, keywords) => {
  const authorsString = (authors ?? []).map(a => a.name).join(", ");

  const markdownContent =
`# ${String(title ?? "").trim()}

**Authors:** ${authorsString}

**Keywords:** ${String(keywords ?? "")}

## Abstract

${String(abstract ?? "").trim()}
`;

  return new File([markdownContent], "README.md", { type: "text/markdown" });
};


export const uploadFileToS3Bucket = async (
        s3_bucket,
        region,
        s3_access_key,
        s3_secret_key,
        file
    ) => {
            // S3 Credentials
        AWS.config.update({
        accessKeyId: s3_access_key,
        secretAccessKey: s3_secret_key,
        });
        const s3 = new AWS.S3({
            params: { Bucket: s3_bucket },
            region: region,
        });


        const params = {
            Bucket: s3_bucket,
            Key: file.name,
            Body: file,
        };

        // Uploading file to s3

        var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
            // File uploading progress
            console.log(
            "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
            );
        })
        .promise();

        await upload.then((err, data) => {
        console.log(err);
        });
  };