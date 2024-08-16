import express, {Request, Response} from "express"
import cors from "cors"
import "dotenv/config"

const app = express();
app.use(express.json())
//app.use(cors)

app.get("/test", async (req: Request, res: Response) => {
    res.json({message: "Hello!"})
})

const port = 4256
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})