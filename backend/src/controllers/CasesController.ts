import { Request, Response } from 'express';
import knex from '../database/connection';

class CasesController {
  async index(request: Request, response: Response) {
    const cases = await knex('cases').select('*');

    const serializedItems = cases.map((cases) => {
      return {
        id: cases.id,
        title: cases.title,
        image_url: `http://localhost:3333/uploads/${cases.image}`,
      };
    });

    return response.json(serializedItems);
  }
}

export default CasesController;