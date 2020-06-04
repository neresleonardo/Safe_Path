import { Request, Response } from 'express';
import knex from '../database/connection';

class InsidentsController {
  async index(request: Request, response: Response) {
    const { city, uf, cases } = request.query;

    const parsedCases = String(cases)
      .split(',')
      .map((case_) => Number(case_.trim()));

    const insidents = await knex('insidents')
      .join('insident_cases', 'insidents.id', '=', 'insident_cases.insident_id')
      .whereIn('insident_cases.case_id', parsedCases)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('insidents.*');

    return response.json(insidents);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const insident = await knex('insidents').where('id', id).first();

    if (!insident) {
      return response.status(400).json({ message: 'Insident not found.' });
    }

    const cases = await knex('cases')
      .join('insident_cases', 'cases.id', '=', 'insident_cases.case_id')
      .where('insident_cases.insident_id', id)
      .select('cases.title');

    return response.json({ insident, cases });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      cases,
    } = request.body;

    const trx = await knex.transaction();

    const insident = {
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx('insidents').insert(insident);

    const insident_id = insertedIds[0];

    const insidentCases = cases.map((case_id: number) => {
      return {
        case_id,
        insident_id,
      };
    });

    await trx('insident_cases').insert(insidentCases);

    await trx.commit();

    return response.json({
      id: insident_id,
      ...insident,
    });
  }
}

export default InsidentsController;