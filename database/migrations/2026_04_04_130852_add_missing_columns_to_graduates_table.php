<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('graduates', function (Blueprint $table) {
            if (!Schema::hasColumn('graduates', 'department')) {
                $table->string('department')->nullable()->after('course');
            }
            if (!Schema::hasColumn('graduates', 'suffix')) {
                $table->string('suffix')->nullable()->after('lastname');
            }
            if (!Schema::hasColumn('graduates', 'place_of_birth')) {
                $table->string('place_of_birth')->nullable()->after('birthdate');
            }
            if (!Schema::hasColumn('graduates', 'nationality')) {
                $table->string('nationality')->nullable()->after('civil_status');
            }
            if (!Schema::hasColumn('graduates', 'religion')) {
                $table->string('religion')->nullable()->after('nationality');
            }
            if (!Schema::hasColumn('graduates', 'city')) {
                $table->string('city')->nullable()->after('address');
            }
            if (!Schema::hasColumn('graduates', 'province')) {
                $table->string('province')->nullable()->after('city');
            }
            if (!Schema::hasColumn('graduates', 'postal_code')) {
                $table->string('postal_code')->nullable()->after('province');
            }
        });
    }

    public function down()
    {
        Schema::table('graduates', function (Blueprint $table) {
            $table->dropColumn(['department', 'suffix', 'place_of_birth', 'nationality', 'religion', 'city', 'province', 'postal_code']);
        });
    }
};