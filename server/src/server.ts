// server.ts

import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import bodyParser from 'body-parser';
import { ConnectionOptions } from 'tls';

// Define types
interface Content {
  text: string;
  image: string;
}

interface PostDocument extends Document {
  title: string;
  content: Content;
}

const PostSchema = new Schema<PostDocument>({
  title: { type: String, required: true },
  content: {
    text: { type: String, required: true },
    image: { type: String, required: true },
  },
});

const Post = mongoose.model<PostDocument>('Post', PostSchema);

const app = express();
const port = 5001;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectionOptions);

app.get('/', (req: Request, res: Response) => {
  console.log('Hello World!');
})
// Define routes
app.post('/posts', (req: Request, res: Response) => {
  const postData: { title: string; content: Content } = req.body;

  const newPost = new Post({
    title: postData.title,
    content: {
      text: postData.content.text,
      image: postData.content.image,
    },
  });

  newPost.save()
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving post' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
