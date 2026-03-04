export type TBootcampCategory = {  
    name: string;  
    slug?: string; 
};  

export type TBootcampResult = {  
    category: TBootcampCategory;  
    totalItems: number;  
    completedItems: number;  
    pinnedItems: number;  
    incompletedItems: number;  
};  