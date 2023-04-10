
import { Todo, TodoWithId, Todos } from './todos.model';
import { Response, Request, NextFunction } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { ObjectId } from 'mongodb';





export const findAll = async (req: Request, res: Response<TodoWithId[]>, next: NextFunction) => {
  try {
    
    const result = Todos.find({});
    const output = await result.toArray();
    
    res.json(output);
    
  } catch (error) {
    next(error);
  }
  
};

export const createOne = async (req: Request<{}, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) => {
  try {
    
    const insertResult = await Todos.insertOne(req.body);
    if (!insertResult.acknowledged) throw new Error('error inserting todo');
    res.status(201).json({
      ...req.body,
      _id: insertResult.insertedId,
    });
  } catch (error) {
    next(error);
 
  }
  
};

export async function findOne(req: Request<ParamsWithId, TodoWithId, {}>, res: Response<TodoWithId>, next: NextFunction) {

  try {
    const result = await Todos.findOne({ _id: new ObjectId(req.params.id) });
    if (!result) {
      res.status(404);
      throw new Error(`Could not find todo with id ${req.params.id}`);
    }
    res.json(result);

  } catch (error) {
    next(error); 
  }

}

export async function updateOne(req: Request<ParamsWithId, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    const result = await Todos.findOneAndUpdate({ 
      _id: new ObjectId(req.params.id), 
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    
    if (!result.value) {
      res.status(404);
      throw new Error(`Could not find todo with id ${req.params.id}`);
    }
    res.status(200).json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Todos.findOneAndDelete({ 
      _id: new ObjectId(req.params.id), 
    });
    if (!result.value) {
      res.status(404);
      throw new Error(`Could not find todo with id ${req.params.id}`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}