# Check if required packages are installed, install if not (optional, better to assume pre-installed to avoid delays)
# if (!require("jsonlite")) install.packages("jsonlite", repos="http://cran.us.r-project.org")

args <- commandArgs(trailingOnly = TRUE)

if (length(args) == 0) {
  stop("No input file provided")
}

file_path <- args[1]

# Read CSV
data <- read.csv(file_path, stringsAsFactors = FALSE)

# Identify numeric columns
numeric_cols <- sapply(data, is.numeric)
numeric_data <- data[, numeric_cols, drop = FALSE]

results <- list()

if (ncol(numeric_data) > 0) {
  for (col_name in names(numeric_data)) {
    vals <- numeric_data[[col_name]]
    vals <- vals[!is.na(vals)] # Remove NAs
    
    if (length(vals) >= 3) { # Shapiro-Wilk requires at least 3 samples
       # Shapiro-Wilk Test
       sw_test <- shapiro.test(vals)
       is_normal <- sw_test$p.value > 0.05
       
       # Summary Stats
       mean_val <- mean(vals)
       median_val <- median(vals)
       sd_val <- sd(vals)
       
       results[[col_name]] <- list(
         key = col_name,
         isNormal = is_normal,
         pValue = sw_test$p.value,
         mean = mean_val,
         median = median_val,
         stdDev = sd_val
       )
    }
  }
}

# Output JSON to stdout
if (!require("jsonlite", quietly = TRUE)) {
    # Fallback manual JSON creation if jsonlite is missing (simple robust fallback for basic list)
    # But jsonlite is standard. We will assume it's there or output error.
    stop("jsonlite package requires to be installed in R environment")
}

cat(jsonlite::toJSON(unname(results), auto_unbox = TRUE))
