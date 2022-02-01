import Router from 'koa-router'

import { db } from '../../../../../utils/index.js'
import Company from '../../../../../models/company.js'
import Person from '../../../../../models/person.js'

const router = Router()

router.put('/batch/tags', async ctx => {
  const companies = []
  for (const company of await db.select(Company, {
    shopName: ['!=', '']
  })) {
    const fireFgtTags = []
    if (company.hasLiving) {
      fireFgtTags.push('店住人')
    }
    if (company.isAlgStreet) {
      fireFgtTags.push('沿街')
    }
    if (company.hasStore) {
      fireFgtTags.push('有仓库')
    }
    if (company.useFire) {
      fireFgtTags.push('用明火')
    }
    if (company.isTopBottom) {
      fireFgtTags.push('高层/地下室')
    }
    const pbcSecuTags = []
    if (company.sellAlcohol) {
      pbcSecuTags.push('销售酒类')
    }
    if (company.sellAlcohol) {
      pbcSecuTags.push('可疑行径')
    }
    companies.push(await db.save(Company, {
      fireFgtTags: fireFgtTags.join(','),
      pbcSecuTags: pbcSecuTags.join(',')
    }, {id: company.id}))
  }
  const people = []
  for (const person of await db.select(Person)) {
    const specTags = []
    if (person.isLvAlnOld) {
      specTags.push('独居老人')
    }
    if (person.isPregWman) {
      specTags.push('孕妇')
    }
    if (person.hasMentalIllness) {
      specTags.push('患精神疾病')
    }
    if (person.isDisability) {
      specTags.push('生理残疾人')
    }
    if (person.isDisability) {
      specTags.push('行径可疑')
    }
    people.push(await db.save(Person, {
      specTags: specTags.join(',')
    }, {id: person.id}))
  }
  ctx.body = {
    data: {companies, people}
  }
})

export default router
