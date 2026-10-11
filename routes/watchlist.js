import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import { getWatchlist, addMovie, updateMovie, deleteMovie } from "../utils/db.js";

const router = Router();

router.use(authenticate);
 
//GET - display
router.get("/:userId", (req, res) => {
    const watchlist = getWatchlist(Number(req.params.userId));
    if (!watchlist) return res.status(404).json({ error: "User not found"});
    res.status(200).json(watchlist);
});
 
//POST - add movie to list
router.post("/:userId/movies", authorizeModification, (req, res) => {
    const movie = addMovie(Number(req.params.userId), req.body);
    if (!movie) return res.status(404).json({ error: "User not found"});
    res.status(201).json(movie);
});

//PUT - update a movie from list
router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    const movie = updateMovie(Number(req.params.userId), Number(req.params.movieId),req.body);
    if (!movie) return res.status(404).json({ error: "Movie not found"});
    res.status(200).json(movie);
});

// DELETE - Remove a movie from list
router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    const result = deleteMovie(Number(req.params.userId), Number(req.params.movieId));
    if (!result) return res.status(404).json({ error: "Movie not found"});
    res.status(200).json({ message: "Movie removed"});
});

export default router;
