// server.ts

import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import bodyParser from 'body-parser';
import { ConnectionOptions } from 'tls';

// Define types
interface BoundingRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  pageNumber: number;
}

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  pageNumber: number;
}

interface Position {
  boundingRect: BoundingRect;
  rects: Rect[];
  pageNumber: number;
}

interface Comment {
  text: string;
  emoji: string;
}

interface ContentData {
  text: string;
  image: string;
}

interface PostData {
  content: ContentData;
  position: Position;
  comment: Comment;
}

interface PostRequestData {
  [url: string]: PostData;
}

const app = express();
const port = 5001;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notetaking-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectionOptions);

// Define Post model
interface PostDocument extends Document {
  title: string;
  content: ContentData;
  position: Position;
  comment: Comment;
}

const PostSchema = new Schema<PostDocument>({
  title: { type: String, required: true },
  content: {
    text: { type: String, required: true },
    image: { type: String, required: false },
  },
  position: {
    boundingRect: {
      x1: { type: Number, required: true },
      y1: { type: Number, required: true },
      x2: { type: Number, required: true },
      y2: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      pageNumber: { type: Number, required: true },
    },
    rects: [
      {
        x1: { type: Number, required: true },
        y1: { type: Number, required: true },
        x2: { type: Number, required: true },
        y2: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        pageNumber: { type: Number, required: true },
      },
    ],
    pageNumber: { type: Number, required: true },
  },
  comment: {
    text: { type: String, required: true },
    emoji: { type: String, required: false },
  },
});

const Post = mongoose.model<PostDocument>('Post', PostSchema);

// Define routes
app.post('/posts', (req: Request, res: Response) => {
  const postData: PostRequestData = req.body;

  // Assuming there is only one key in postData
  const url = Object.keys(postData)[0];
  const postContent = postData[url];

  if (url && postContent) {
    const newPost = new Post({
      title: url,
      content: {
        text: postContent.content.text || '',
        image: postContent.content.image || '',
      },
      position: postContent.position || {},
      comment: postContent.comment || {},
    });

    newPost
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Error saving post' });
      });
  } else {
    res.status(400).json({ error: 'Invalid request format' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
