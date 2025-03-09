import slugify from "slugify";

export const create = async (req, res) =>{
    const {name} = req.body;
    const slug = slugify(name);
    return res.json(slug);
}