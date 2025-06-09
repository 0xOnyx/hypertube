export declare class MovieSearchDto {
    query?: string;
    genres?: string[];
    yearMin?: number;
    yearMax?: number;
    ratingMin?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
