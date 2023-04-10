import { ObjectId } from 'mongodb';
import * as z from 'zod';

export const ParamsWithId = z.object({
  id: z.string().min(1).refine((val)=>{
    try {
      return new ObjectId(val);
    } catch (error) {
      return false;
    }
  }, {
    message: 'Invalid Object id',
  }),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;