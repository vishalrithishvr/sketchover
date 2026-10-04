import multer from "multer";

// Files are held in memory on their way to GridFS, so nothing is written to a
// disk the host may wipe between deploys. 200 MB covers a long review video.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 200 * 1024 * 1024 },
})

export default upload
